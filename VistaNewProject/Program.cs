using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VistaNewProject.Services;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllersWithViews();
builder.Services.AddSession();
builder.Services.AddHttpClient("ApiHttpClient", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["AppSettings:ApiBaseUrl"]);
});
builder.Services.AddScoped<IApiClient, ApiClient>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton<PasswordHasherService>();
builder.Services.AddScoped<ProductoService>();
builder.Services.AddScoped<RolService>();


// Configurar autenticación basada en cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(100000);
        options.LoginPath = "/Login/Index";
        options.LogoutPath = "/Login/Logout";
    });

// Agregar el servicio de autorización aquí
builder.Services.AddAuthorization(async options =>
{
    // Obtener roles de manera asíncrona dentro de la configuración de políticas
    var roles = await ObtenerRolesAsync(builder.Services);

    foreach (var rol in roles)
    {
        options.AddPolicy($"{rol.NombreRol}", policy =>
            policy.RequireClaim("RolId", rol.RolId));
    }
});

var app = builder.Build();

// Configurar el entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// Middleware base para la aplicación web
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Habilitar autenticación, autorización y sesiones
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();

app.UseCors(builder =>
{
    builder.WithOrigins("https://localhost:7226")
           .AllowAnyHeader()
           .AllowAnyMethod()
           .AllowCredentials();
});

// Configurar el enrutamiento predeterminado de controladores
app.MapDefaultControllerRoute();

app.Run();

// Método asincrónico para obtener roles
async Task<List<RolService.RolList>> ObtenerRolesAsync(IServiceCollection services)
{
    using var scope = services.BuildServiceProvider().CreateScope();
    var rolesService = scope.ServiceProvider.GetRequiredService<RolService>();
    var roles = await rolesService.ObtenerRolesAsync();

    if (roles == null || roles.Count == 0)
    {
        Console.WriteLine("No se encontraron roles.");
    }
    else
    {
        Console.WriteLine("Roles encontrados:");
        foreach (var rol in roles)
        {
            Console.WriteLine($"Nombre del Rol: {rol.NombreRol}, ID del Rol: {rol.RolId}");
        }
    }

    return roles;
}
