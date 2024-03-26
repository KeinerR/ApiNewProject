namespace VistaNewProject.Models
{
    public class Presentacion
    {
        public int PresentacionId { get; set; }
        public string? NombrePresentacion { get; set; }
        public string? DescripcionPresentacion { get; set; }

        public virtual ICollection<Producto> Productos { get; set; }

    }
}
