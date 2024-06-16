using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace VistaNewProject.Models
{
    public class Presentacion
    {
        public int PresentacionId { get; set; }

        [Required(ErrorMessage = "El nombre de la presentación es obligatorio.")]
        [MinLength(5, ErrorMessage = "El nombre de la presentación debe tener al menos 5 caracteres.")]
        public string? NombrePresentacion { get; set; }

        public string? DescripcionPresentacion { get; set; }

        [Required(ErrorMessage = "El contenido es obligatorio.")]
        [MinLength(2, ErrorMessage = "El contenido debe tener al menos 2 caracteres.")]
        public string? Contenido { get; set; }

        [Required(ErrorMessage = "La cantidad por presentación es obligatoria.")]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad por presentación debe ser mayor que 0.")]
        public int? CantidadPorPresentacion { get; set; }

        [BindNever]
        public string? NombreCompleto { get; set; }

        [BindNever]
        public ulong? EstadoPresentacion { get; set; }

        public virtual ICollection<Producto>? Productos { get; set; }
    }
}
