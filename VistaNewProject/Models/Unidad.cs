namespace VistaNewProject.Models
{
    public class Unidad
    {
        public int UnidadId { get; set; }
        public string? DescripcionUnidad { get; set; }

        public decimal Contenido { get; set; }
        public ulong? EstadoUnidad { get; set; }

        public virtual ICollection<Producto> Productos { get; set; }

    }
}
