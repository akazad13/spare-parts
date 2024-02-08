using SpareParts.Api.Infrastructure.IoC;
using SpareParts.Api.Infrastructure.SwaggerService;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Register(builder.Configuration);

var app = builder.Build();

app.UseCors(builder =>
{
    builder
        .WithOrigins(Origins())
        .SetIsOriginAllowedToAllowWildcardSubdomains()
        .AllowAnyHeader()
        .AllowAnyMethod();
});

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseSwaggerDocumentation();

app.MapControllers();

app.Run();

static string[] Origins() => ["http://localhost:4200", "http://localhost:4201"];
