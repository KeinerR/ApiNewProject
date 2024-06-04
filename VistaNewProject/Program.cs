using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using VistaNewProject.Services; // Importar el namespace correcto

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor
builder.Services.AddControllersWithViews(); // Soporte para controladores y vistas
builder.Services.AddSession(); // Habilitar sesiones

// Configurar cliente HTTP para la API
builder.Services.AddHttpClient("ApiHttpClient", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["AppSettings:ApiBaseUrl"]); // Base URL de la API desde la configuración
});
builder.Services.AddScoped<IApiClient, ApiClient>(); // Registrar ApiClient como un servicio scoped

// Registrar IHttpContextAccessor
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Registrar el servicio de hashing de contraseñas
builder.Services.AddSingleton<PasswordHasherService>();

// Configurar autenticación basada en cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always; // Cookies solo a través de HTTPS
        options.Cookie.HttpOnly = true; // Cookies no accesibles a JavaScript
        options.ExpireTimeSpan = TimeSpan.FromMinutes(100000); // Duración de la sesión
        options.LoginPath = "/Login/Index"; // Ruta de inicio de sesión
        options.LogoutPath = "/Login/Logout"; // Ruta de cierre de sesión
    });

// Configurar políticas de autorización
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RolAdministrador", policy =>
        policy.RequireClaim("RolId", "1")); // Requiere RolId "1"
    options.AddPolicy("RolCajero", policy =>
        policy.RequireClaim("RolId", "2")); // Requiere RolId "2"
    options.AddPolicy("RolDomiciliario", policy =>
        policy.RequireClaim("RolId", "3")); // Requiere RolId "3"
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error"); // Manejo de errores en producción
    app.UseHsts(); // Habilitar HSTS para seguridad
}

// Middleware base para la aplicación web
app.UseHttpsRedirection(); // Redirigir HTTP a HTTPS
app.UseStaticFiles(); // Servir archivos estáticos
app.UseRouting(); // Habilitar el enrutamiento

// Habilitar autenticación, autorización y sesiones
app.UseAuthentication();
app.UseAuthorization();
app.UseSession();

app.UseCors(builder =>
{
    builder.WithOrigins("https://localhost:7226") // Permitir CORS desde este origen
           .AllowAnyHeader()
           .AllowAnyMethod()
           .AllowCredentials(); // Permitir el uso de cookies en solicitudes CORS
});

// Configurar el enrutamiento predeterminado de controladores
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run(); // Ejecutar la aplicación
