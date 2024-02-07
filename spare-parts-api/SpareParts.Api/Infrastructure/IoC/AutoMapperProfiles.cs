using AutoMapper;
using SpareParts.Domain.Dtos;
using SpareParts.Domain.Models;

namespace SpareParts.Api.Infrastructure.IoC
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<UpdateCustomerProfileDto, User>();
            CreateMap<AddressDto, UserAddress>();
            CreateMap<UserProfileDto, UserProfile>();
        }
    }
}
