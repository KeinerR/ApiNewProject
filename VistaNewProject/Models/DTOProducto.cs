using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace VistaNewProject.Models
{
    public class Categoria
    {
        public int CategoriaId { get; set; }

        [Required(ErrorMessage = "El nombre de la categoría es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la categoría no puede exceder los 40 caracteres.")]
        public string? NombreCategoria { get; set; }
        public ulong? EstadoCategoria { get; set; }

    }
    public class CategoriaUpdate
    {
        public int CategoriaId { get; set; }

        [Required(ErrorMessage = "El nombre de la categoría es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la categoría no puede exceder los 40 caracteres.")]
        public string? NombreCategoria { get; set; }
        public ulong? EstadoCategoria { get; set; }

    }

    public class Marca
    {
        [BindNever]
        public int MarcaId { get; set; }
        [Required(ErrorMessage = "El nombre de la marca es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la marca no puede exceder los 40 caracteres.")]
        public string? NombreMarca { get; set; }
        [BindNever]
        public ulong? EstadoMarca { get; set; }

    }
    public class MarcaUpdate
    {
        public int MarcaId { get; set; }
        [Required(ErrorMessage = "El nombre de la categoría es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la categoría no puede exceder los 40 caracteres.")]
        public string? NombreMarca { get; set; }

        public ulong? EstadoMarca { get; set; }

    }

    public class Presentacion
    {
        public int PresentacionId { get; set; }

        [Required(ErrorMessage = "El nombre de la presentación es obligatorio.")]
        [MinLength(5, ErrorMessage = "El nombre de la presentación debe tener al menos 5 caracteres.")]
        public string? NombrePresentacion { get; set; }
        public string? NombreCompletoPresentacion { get; set; }

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
    public class PresentacionCrearYActualizar
    {
        public int PresentacionId { get; set; }
        [Required(ErrorMessage = "El nombre de la categoría es obligatorio.")]
        [StringLength(40, ErrorMessage = "El nombre de la categoría no puede exceder los 40 caracteres.")]
        public string? NombrePresentacion { get; set; }
        public string? NombreCompletoPresentacion { get; set; }

        public string? DescripcionPresentacion { get; set; }
        [Required(ErrorMessage = "El contenido es obligatorio.")]
        [MinLength(2, ErrorMessage = "El contenido debe tener al menos 2 caracteres.")]
        public string? Contenido { get; set; }
        [Required(ErrorMessage = "La cantidad por presentación es obligatoria.")]
        [Range(1, int.MaxValue, ErrorMessage = "La cantidad por presentación debe ser mayor que 0.")]
        public int? CantidadPorPresentacion { get; set; }
        public ulong? EstadoPresentacion { get; set; }

    }

    public class Producto
    {
        public int ProductoId { get; set; }
        public int? PresentacionId { get; set; }
        public int? MarcaId { get; set; }
        public int? CategoriaId { get; set; }
        public string? NombreProducto { get; set; }
        public int? CantidadTotal { get; set; } = 0;
        public int? CantidadReservada { get; set; } = 0;
        public int? CantidadPorPresentacion { get; set; }
        public string? NombreCompletoProducto { get; set; }
        public int CantidadAplicarPorMayor { get; set; }
        public int DescuentoAplicarPorMayor { get; set; }
        public string? NombrePresentacion { get; set; }
        public string? NombreCompletoPresentacion { get; set; }
        public string? NombreMarca { get; set; }
        public string? NombreCategoria { get; set; }
        public string? Contenido { get; set; }
        public ulong? Estado { get; set; }
        public int CantidadTotalPorUnidad => CantidadTotal * CantidadPorPresentacion ?? 0;
        public virtual Categoria? Categoria { get; set; }
        public virtual Marca? Marca { get; set; }
        public virtual Presentacion? Presentacion { get; set; }
        public virtual Unidad? Unidad { get; set; }
        public virtual ICollection<Lote> Lotes { get; set; }
        public virtual ICollection<Movimiento> Movimientos { get; set; }
    }
    public class ProductoCrearYActualizar
    {
        public int ProductoId { get; set; }
        public int? PresentacionId { get; set; }
        public int? MarcaId { get; set; }
        public int? CategoriaId { get; set; }
        public string? NombreProducto { get; set; }
        public string? NombreCompletoProducto { get; set; }
        public int CantidadAplicarPorMayor { get; set; }
        public int DescuentoAplicarPorMayor { get; set; }
        public ulong? Estado { get; set; }

    }
    public class ProductoEnd
    {
        public int ProductoId { get; set; }
        [Required(ErrorMessage = "El nombre de la presentacion es obligatorio.")]
        public int? PresentacionId { get; set; }
        [Required(ErrorMessage = "El nombre de la marca es obligatorio.")]
        public int? MarcaId { get; set; }
        [Required(ErrorMessage = "El nombre de la categorìa es obligatorio.")]
        public int? CategoriaId { get; set; }
        [Required(ErrorMessage = "El nombre del producto es obligatorio.")]
        public string? NombreProducto { get; set; }
        public int? CantidadTotal { get; set; }
        public int CantidadAplicarPorMayor { get; set; }
        public int DescuentoAplicarPorMayor { get; set; }
        public ulong? Estado { get; set; }
    }

    public class ProveedorUpdate
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

        public ulong? EstadoProveedor { get; set; }

    }
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
        public virtual ICollection<Producto>? Productos { get; set; }

    }
    public class UnidadUpdate
    {
        public int UnidadId { get; set; }
        public string? NombreUnidad { get; set; }
        public int? CantidadPorUnidad { get; set; }
        public string? DescripcionUnidad { get; set; }
        public ulong? EstadoUnidad { get; set; }
        public virtual ICollection<Producto>? Productos { get; set; }

    }
}