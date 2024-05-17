namespace VistaNewProject.Models
{
    public class Unidad
    {
        public int UnidadId { get; set; }
        public string? NombreUnidad { get; set; }
        public int? CantidadPorUnidad { get; set; }
        public string? DescripcionUnidad { get; set; }
        public ulong? EstadoUnidad { get; set; }
        public virtual ICollection <Producto>? Productos { get; set; }

    }
}
