using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using VistaNewProject.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

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

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.FromMinutes(100000);
        options.LoginPath = "/Login/Index";
        options.LogoutPath = "/Login/Logout";
    });

builder.Services.AddAuthorization(options =>
{
options.AddPolicy("Administrador", policy => policy.RequireClaim("NombreRol", "Administrador"));

options.AddPolicy("Cajero", policy => policy.RequireClaim("NombreRol", "Cajero"));

options.AddPolicy("Domiciliario", policy => policy.RequireClaim("NombreRol", "Domiciliario"));

options.AddPolicy("CualquierRol", policy => policy.RequireRole("UsuarioRegistrado"));

});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

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

app.MapDefaultControllerRoute();

app.Run();


