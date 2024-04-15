using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using VistaNewProject.Services;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios al contenedor.
builder.Services.AddControllersWithViews();
builder.Services.AddSession();
// Agregar cliente HTTP para la API
builder.Services.AddHttpClient("ApiHttpClient", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["AppiSetting:ApiBaseUrl"]);
});
builder.Services.AddScoped<IApiClient, ApiClient>();

// Agregar IHttpContextAccessor
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

// Configurar la autenticación basada en cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(100000); // Cambia según tus necesidades
        options.LoginPath = "/Login/Index"; // Ruta de inicio de sesión
        options.LogoutPath = "/Login/Logout"; // Ruta de cierre de sesión
        // options.AccessDeniedPath = "/Account/AccessDenied"; // Ruta de acceso denegado
    });

// Configurar las políticas de autorización
builder.Services.AddAuthorization(options =>
{

    options.AddPolicy("RolAdministrador", policy =>
        policy.RequireClaim("RolId", "1")); // La política requiere que el usuario tenga una reclamación de RolId con el valor "1"

    options.AddPolicy("RolCajero", policy =>
        policy.RequireClaim("RolId", "2")); // La política requiere que el usuario tenga una reclamación de RolId con el valor "2"

    options.AddPolicy("RolDomiciliario", policy =>
        policy.RequireClaim("RolId", "3")); // La política requiere que el usuario tenga una reclamación de RolId con el valor "3"
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// Habilitar el middleware de autenticación y autorización
app.UseAuthentication();
app.UseAuthorization();

app.UseSession();
app.UseCors(builder =>
{
    builder.WithOrigins("https://localhost:7226") // Agrega aquí el dominio de tu cliente web
           .AllowAnyHeader()
           .AllowAnyMethod();
});

// Configurar las rutas predeterminadas y el enrutamiento
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
