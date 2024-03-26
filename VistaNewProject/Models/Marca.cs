namespace VistaNewProject.Models
{
    public class Marca
    {
        public int MarcaId { get; set; }
        public string? NombreMarca { get; set; }

        public virtual ICollection<Producto> Productos { get; set; }
    }
}
