using SpareParts.AppService.ServiceInterfaces;
using SpareParts.AppService.Services;
using SpareParts.Data.Repository;
using SpareParts.Data.RepositoryInterfaces;
using Lamar;
using Microsoft.Extensions.DependencyInjection;

namespace SpareParts.Api.Infrastructure.IoC
{
    public class ServiceRegister : ServiceRegistry
    {
        public ServiceRegister()
        {
            Register(this);
        }

        private void Register(ServiceRegistry services)
        {
            RepositoryRegister(services);
            ServicesRegister(services);
        }

        private void RepositoryRegister(ServiceRegistry services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
        }

        private void ServicesRegister(ServiceRegistry services)
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
