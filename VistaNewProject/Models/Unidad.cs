using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace VistaNewProject.Models
{
    public class Unidad
    {
        [BindNever]
        public int UnidadId { get; set; }
        [Required(ErrorMessage = "El nombre de la Unidad es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la Unidad no puede exceder los 40 caracteres.")]
        public string? NombreUnidad { get; set; }
        [Required(ErrorMessage = "La cantidad por unidad es obligatoria.")]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad por unidad debe ser mayor que 0.")]
        public int? CantidadPorUnidad { get; set; }
        public string? DescripcionUnidad { get; set; }
        [BindNever]
        public ulong? EstadoUnidad { get; set; }
        public virtual ICollection <Producto>? Productos { get; set; }

    }
}
