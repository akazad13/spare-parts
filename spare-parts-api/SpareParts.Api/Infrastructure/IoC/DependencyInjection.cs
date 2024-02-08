using Amazon.SimpleEmail;
using AutoMapper;
using SpareParts.Api.Infrastructure.SwaggerService;
using SpareParts.Domain.Models.Authentication;
using SpareParts.Domain.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SpareParts.Data.RepositoryInterfaces;
using SpareParts.Data.Repository;
using SpareParts.AppService.ServiceInterfaces;
using SpareParts.AppService.Services;

namespace SpareParts.Api.Infrastructure.IoC
{
    public static class DependencyInjection
    {
        public static void Register(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddControllers();
            services.AddCors();
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
                    var signingKey = Convert.FromBase64String(configuration["Jwt:SigningSecret"]!);
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

            RepositoryRegister(services);
            ServicesRegister(services);
        }

        private static void RepositoryRegister(IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
        }

        private static void ServicesRegister(IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IProductService, ProductService>();
            services.AddSingleton<IEmailService, EmailService>();
            //services.AddScoped<IBlobService, BlobService>();
            //services.AddScoped<IImageService, ImageService>();
            //services.AddScoped<ICategoryService, CategoryService>();
            //services.AddScoped<IProductService, ProductService>();
            //services.AddScoped<ITokenCleanerService, TokenCleanerService>();
            //services.AddScoped<IPlaceOrderService, PlaceOrderService>();
            //services.AddScoped<IOrderService, OrderService>();
        }
    }
}
