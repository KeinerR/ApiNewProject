namespace VistaNewProject.Models
{
    public class Categoria
    {
        public int CategoriaId { get; set; }
        public string? NombreCategoria { get; set; }
        public ulong? EstadoCategoria { get; set; }

        public virtual ICollection<Producto> Productos { get; set; }
    }
}
