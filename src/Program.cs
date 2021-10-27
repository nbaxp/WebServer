using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
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
                        app.UseFileServer();
                        app.UseRouting();
                        app.UseAuthorization();
                        app.UseEndpoints(endpoints =>
                        {
                            endpoints.MapControllerRoute(
                                name: "default",
                                pattern: "{controller}/{action=Index}/{id?}");
                        });
                        var config = app.ApplicationServices.GetService<IConfiguration>();
                        app.UseDefaultFiles();
                        app.Use(async (context, next) =>
                        {
                            if (context.GetEndpoint() != null)
                            {
                                await next.Invoke();
                            }
                            else
                            {
                                var mode = config.GetValue("spa", 0);
                                if (mode == 1)
                                {
                                    var env = context.RequestServices.GetService<IWebHostEnvironment>();
                                    var file = Path.Combine(env.WebRootPath, "index.html");
                                    await context.Response.WriteAsync(File.ReadAllText(file));
                                }
                                else if (mode == 2)
                                {
                                    var query = QueryHelpers.ParseQuery(context.Request.QueryString.Value);
                                    query.Add("route", context.Request.Path.Value);
                                    var url = "/" + new QueryBuilder(query).ToQueryString();
                                    context.Response.Redirect(url);
                                }
                            }
                            //await next.Invoke();
                        });
                    });
                })
                .Build()
                .Run(); ;
        }
    }
}