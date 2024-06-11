using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace VistaNewProject.Models
{
    public class Proveedor
    {
        public int ProveedorId { get; set; }

        [Required(ErrorMessage = "El nombre de la empresa es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la empresa no puede exceder los 40 caracteres.")]
        public string? NombreEmpresa { get; set; }

        [Required(ErrorMessage = "El nombre del contacto es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre del contacto no puede exceder los 40 caracteres.")]
        public string? NombreContacto { get; set; }

        [Required(ErrorMessage = "La dirección es obligatoria.")]
        [StringLength(40, ErrorMessage = "La dirección no puede exceder los 40 caracteres.")]
        public string? Direccion { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio.")]
        [StringLength(40, ErrorMessage = "El teléfono no puede exceder los 40 caracteres.")]
        public string? Telefono { get; set; }

        [Required(ErrorMessage = "El correo es obligatorio.")]
        [StringLength(40, ErrorMessage = "El correo no puede exceder los 40 caracteres.")]
        public string? Correo { get; set; }

        [BindNever]
        public ulong? EstadoProveedor { get; set; }
    }
}
