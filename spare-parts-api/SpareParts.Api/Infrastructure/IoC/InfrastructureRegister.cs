using Amazon.SimpleEmail;
using AutoMapper;
using SpareParts.Api.Infrastructure.SwaggerService;
using SpareParts.Domain.Models.Authentication;
using SpareParts.Domain.Utilities;
using Lamar;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;

namespace SpareParts.Api.Infrastructure.IoC
{
    public static class InfrastructureRegister
    {
        public static void Register(ServiceRegistry services, IConfiguration configuration)
        {
            services.Configure<ConfigModel>(configuration);
            services.AddHttpContextAccessor();

            services.AddAuthorization(options =>
            {
                options.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
                options.AddPolicy("RequireStandardRole", policy => policy.RequireRole("Standard"));
                options.AddPolicy("RequireDealerRole", policy => policy.RequireRole("Dealer"));
                options.AddPolicy("RequireCustomerRole", policy => policy.RequireRole("Customer"));
                options.AddPolicy(
                    "RequireDashboardUser",
                    policy =>
                        policy.RequireClaim(
                            ClaimType.CurrentUserRole,
                            "Admin",
                            "Dealer",
                            "Standard"
                        )
                );
            });

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    var signingKey = Convert.FromBase64String(configuration["Jwt:SigningSecret"]);
                    var validIssuer = configuration["Jwt:ValidIssuer"];
                    var validAudience = configuration["Jwt:ValidAudience"];
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = validIssuer,
                        ValidateAudience = true,
                        ValidAudience = validAudience,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(signingKey),
                        ClockSkew = TimeSpan.Zero, //dotnet gives 5-10 more minuts if ClockSkew is not set
                    };
                });

            services.AddDefaultAWSOptions(configuration.GetAWSOptions());
            services.AddAWSService<IAmazonSimpleEmailService>();

            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new AutoMapperProfiles());
            });

            IMapper mapper = mappingConfig.CreateMapper();
            services.AddSingleton(mapper);

            services.AddSwaggerDocumentation();
        }
    }
}
