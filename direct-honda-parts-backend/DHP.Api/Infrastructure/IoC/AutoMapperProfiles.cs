using AutoMapper;
using DHP.Domain.Dtos;
using DHP.Domain.Models;

namespace DHP.Api.Infrastructure.IoC
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
