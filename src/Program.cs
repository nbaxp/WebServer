using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
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

        /// <summary>
        /// https://github.com/dotnet/aspnetcore/blob/main/src/DefaultBuilder/src/WebHost.cs
        /// </summary>
        /// <param name="args"></param>
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
                        using var o = services.BuildServiceProvider();
                        var config = o.GetService<IConfiguration>();
                        if (config.GetValue("spa", true))
                        {
                            services.AddSpaStaticFiles(configuration =>
                            {
                                configuration.RootPath = config.GetValue("wwwroot", "wwwroot");
                            });
                        }
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
                        if (config.GetValue("spa", true))
                        {
                            app.UseSpaStaticFiles();
                            app.UseSpa(spa =>
                            {
                                spa.Options.SourcePath = config.GetValue("wwwroot", "wwwroot");
                            });
                        }
                        app.UseDefaultFiles();
                    });
                })
                .Build()
                .Run(); ;
        }
    }
}