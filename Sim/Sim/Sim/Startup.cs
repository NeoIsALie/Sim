using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Sim.Hubs;
using Sim.Models;
using Sim.Repositories;
using Sim.Repositories.Implementation;
using Sim.Services;
using Sim.Services.Implementation;
using System.Text;
using System.Threading.Tasks;

namespace Sim
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);

            services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));
            services.AddIdentity<ApplicationUser, IdentityRole>(options =>
                {
                    options.Password.RequireDigit = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequiredLength = 3;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.Configure<AuthOptions>(Configuration.GetSection("AuthOptions"));
            var authOptions = Configuration.GetSection("AuthOptions").Get<AuthOptions>();
            var secret = Encoding.ASCII.GetBytes(authOptions.Secret);

            services.AddAuthentication(options => {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme =JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = false,
                    IssuerSigningKey = new SymmetricSecurityKey(secret),
                    ValidateIssuerSigningKey = true
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];

                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) &&
                            (path.StartsWithSegments("/gameroom")))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddSignalR();

            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build();
            });

            services.AddSingleton<IGamesCollection, GamesCollection>();
            services.AddScoped<ITokenAuthenticationService, TokenAuthenticationService>();
            services.AddTransient<IRoomsRepository, RoomsRepository>();
            services.AddTransient<IGamesRepository, GamesRepository>();
            services.AddTransient<IGameConfigurationsRepository, GameConfigurationsRepository>();
            services.AddTransient<IGameService, GameService>();
            services.AddTransient<IRoomService, RoomService>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseWebSockets();
            app.UseSignalR(routes =>
            {
                routes.MapHub<GameRoomHub>("/gameroom");
            });

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "Sim",
                    template: "Sim/{*AngularRoute}",
                    defaults: new { controller = "Main", action = "Index" });

                routes.MapRoute(
                    name: "default",
                    template: "{controller=Main}/{action=Index}/{id?}");
            });
        }
    }
}
