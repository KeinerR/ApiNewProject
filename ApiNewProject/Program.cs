using ApiNewProject.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using MySql.EntityFrameworkCore.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEntityFrameworkMySQL()
    .AddDbContext<NewOptimusContext>(options =>
    {
        options.UseMySQL(builder.Configuration.GetConnectionString("conexion"));
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