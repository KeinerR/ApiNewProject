using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using VistaNewProject.Services;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor.
builder.Services.AddControllersWithViews();
builder.Services.AddSession();
// Agregar cliente HTTP para la API
builder.Services.AddHttpClient("ApiHttpClient", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["AppSettings:ApiBaseUrl"]); // Corregido el nombre de la secci�n de configuraci�n
});
builder.Services.AddScoped<IApiClient, ApiClient>();

// Agregar IHttpContextAccessor
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Configurar la autenticaci�n basada en cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(100000); // Cambia seg�n tus necesidades
        options.LoginPath = "/Login/Index"; // Ruta de inicio de sesi�n
        options.LogoutPath = "/Login/Logout"; // Ruta de cierre de sesi�n
        // options.AccessDeniedPath = "/Account/AccessDenied"; // Ruta de acceso denegado
    });

// Configurar las pol�ticas de autorizaci�n
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RolAdministrador", policy =>
        policy.RequireClaim("RolId", "1")); // La pol�tica requiere que el usuario tenga una reclamaci�n de RolId con el valor "1"

    options.AddPolicy("RolCajero", policy =>
        policy.RequireClaim("RolId", "2")); // La pol�tica requiere que el usuario tenga una reclamaci�n de RolId con el valor "2"

    options.AddPolicy("RolDomiciliario", policy =>
        policy.RequireClaim("RolId", "3")); // La pol�tica requiere que el usuario tenga una reclamaci�n de RolId con el valor "3"
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

//Estas l�neas de c�digo establecen la base para el funcionamiento de tu aplicaci�n web:
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

// Habilitar el middleware de autenticaci�n y autorizaci�n
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();

app.UseCors(builder =>
{
    builder.WithOrigins("https://localhost:7226") // Agrega aqu� el dominio de tu cliente web
           .AllowAnyHeader()
           .AllowAnyMethod()
           .AllowCredentials(); // Agregado para permitir el uso de cookies en la solicitud CORS
});

// Configurar las rutas predeterminadas y el enrutamiento
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
