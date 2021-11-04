using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text.Encodings.Web;
using System.Text.Unicode;

namespace WebServer
{
    public class Program
    {
        private static readonly string _origins = "AllowAllHeaders";

        public static void Main(string[] args)
        {
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    var config = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: true)
                    .Build();
                    webBuilder.UseConfiguration(config);
                    webBuilder.ConfigureLogging(o =>
                    {
                        o.ClearProviders();
                        o.AddConsole();
                    });
                    webBuilder.ConfigureServices(services =>
                    {
                        services.AddSingleton(HtmlEncoder.Create(UnicodeRanges.All));
                        services.AddHttpClient();
                        services.AddCors(options => options.AddPolicy(_origins,
                            builder =>
                            {
                                builder.SetIsOriginAllowed(o => true)
                                .AllowAnyMethod()
                                .AllowAnyHeader()
                                .AllowCredentials();
                            }));
                        services.AddControllersWithViews();
                    });
                    webBuilder.Configure(app =>
                    {
                        app.UseCors(_origins);
                        app.UseHttpsRedirection();
                        app.UseStaticFiles();
                        app.UseRouting();
                        app.UseAuthorization();
                        app.UseEndpoints(endpoints =>
                        {
                            endpoints.MapControllerRoute(
                                name: "default",
                                pattern: "{controller}/{action=Index}/{id?}");
                        });
                        app.Use(async (context, next) =>
                        {
                            if (context.GetEndpoint() != null)
                            {
                                await next.Invoke();
                            }
                            else
                            {
                                var mode = config.GetValue("spa", 0);
                                if (mode != 0 && !context.Request.Path.Value.EndsWith("aspnetcore-browser-refresh.js"))
                                {
                                    var env = context.RequestServices.GetService<IWebHostEnvironment>();
                                    var sep = '/';
                                    var path = context.Request.Path.Value.TrimEnd(sep);
                                    var file = string.Empty;
                                    while (true)
                                    {
                                        file = env.WebRootPath + path + "/index.html";
                                        if (File.Exists(file))
                                        {
                                            break;
                                        }
                                        if (string.IsNullOrEmpty(path))
                                        {
                                            break;
                                        }
                                        path = path.Substring(0, path.LastIndexOf(sep));
                                    }
                                    if (!string.IsNullOrEmpty(file))
                                    {
                                        path += sep;
                                        context.Response.Headers.Add("x-real-path", path);
                                        var html = File.ReadAllText(Path.Combine(env.WebRootPath, file));
                                        html = html.Replace("<head>", $"<head>\n\t<base href=\"{path}\" />");
                                        await context.Response.WriteAsync(html);
                                    }
                                    else
                                    {
                                        await next.Invoke();
                                    }
                                }
                                else
                                {
                                    await next.Invoke();
                                }
                            }
                        });
                    });
                })
                .Build()
                .Run(); ;
        }
    }
}