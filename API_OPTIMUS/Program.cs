using API_OPTIMUS.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using API_OPTIMUS.Controllers;
using MySql.EntityFrameworkCore.Extensions;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEntityFrameworkMySQL()
    .AddDbContext<OptimusContext>(options =>
    {
        options.UseMySQL(builder.Configuration.GetConnectionString("conexion") ?? throw new ArgumentNullException("No se encontró la cadena de conexión 'conexion'"));
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "APIOPTIMUS",
        Version = "v1"
    });
});
// Registrar los controladores para la inyección de dependencias
builder.Services.AddScoped<ProductosController>();

//// Registrar los controladores para la inyección de dependencias
//builder.Services.AddScoped<ProductosController>();

var app = builder.Build();

// Habilitar CORS
app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
