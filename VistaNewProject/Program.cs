using VistaNewProject.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddHttpClient( "ApiHttpClient", Client =>
{
    Client.BaseAddress = new Uri(builder.Configuration["AppiSetting:ApiBaseUrl"]); 
}
);
builder.Services.AddScoped< IApiClient, ApiClient>();

builder.Services.AddHttpClient("ApiHttpClient", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["AppiSetting:ApiBaseUrl"]);
});
builder.Services.AddScoped<IApiClient, ApiClient>();


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

app.UseAuthorization();

app.UseCors(builder =>
{
    builder.WithOrigins("https://localhost:7226") // Agrega aquí el dominio de tu cliente web
           .AllowAnyHeader()
           .AllowAnyMethod();
});

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();