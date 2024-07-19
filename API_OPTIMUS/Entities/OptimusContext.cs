using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace API_OPTIMUS.Entities;

public partial class OptimusContext : DbContext
{
    public OptimusContext()
    {
    }

    public OptimusContext(DbContextOptions<OptimusContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CategoriaxMarca> CategoriaxMarcas { get; set; }

    public virtual DbSet<CategoriaxPresentacion> CategoriaxPresentaciones { get; set; }

    public virtual DbSet<CategoriaxUnidad> CategoriaxUnidades { get; set; }

    public virtual DbSet<Categoria> Categorias { get; set; }

    public virtual DbSet<Cliente> Clientes { get; set; }

    public virtual DbSet<Compra> Compras { get; set; }

    public virtual DbSet<Detallecompra> Detallecompras { get; set; }

    public virtual DbSet<Detallepedido> Detallepedidos { get; set; }

    public virtual DbSet<Domicilio> Domicilios { get; set; }

    public virtual DbSet<Lote> Lotes { get; set; }

    public virtual DbSet<Marca> Marcas { get; set; }

    public virtual DbSet<Movimiento> Movimientos { get; set; }

    public virtual DbSet<Pedido> Pedidos { get; set; }

    public virtual DbSet<Permiso> Permisos { get; set; }

    public virtual DbSet<Presentacion> Presentaciones { get; set; }

    public virtual DbSet<Producto> Productos { get; set; }

    public virtual DbSet<Proveedor> Proveedores { get; set; }

    public virtual DbSet<Rol> Roles { get; set; }

    public virtual DbSet<Rolxpermiso> Rolxpermisos { get; set; }

    public virtual DbSet<Unidad> Unidades { get; set; }

    public virtual DbSet<UnidadxProducto> UnidadesxProducto { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CategoriaxMarca>(entity =>
        {
            entity.HasKey(e => new { e.CategoriaId, e.MarcaId }).HasName("PRIMARY");

            entity.ToTable("categoriaxmarca");

            entity.HasIndex(e => e.MarcaId, "MarcaID");

            entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
            entity.Property(e => e.MarcaId).HasColumnName("MarcaID");
            entity.Property(e => e.EstadoCategoria).HasColumnType("bit(1)");
            entity.Property(e => e.EstadoMarca).HasColumnType("bit(1)");
            entity.Property(e => e.NombreCategoria).HasMaxLength(100);
            entity.Property(e => e.NombreMarca).HasMaxLength(100);

        });

        modelBuilder.Entity<CategoriaxPresentacion>(entity =>
        {
            entity.HasKey(e => new { e.CategoriaId, e.PresentacionId }).HasName("PRIMARY");

            entity.ToTable("categoriaxpresentacion");

            entity.HasIndex(e => e.PresentacionId, "PresentacionID");

            entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
            entity.Property(e => e.PresentacionId).HasColumnName("PresentacionID");
            entity.Property(e => e.Contenido).HasMaxLength(50);
            entity.Property(e => e.EstadoCategoria).HasColumnType("bit(1)");
            entity.Property(e => e.EstadoPresentacion)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.NombreCategoria).HasMaxLength(100);
            entity.Property(e => e.NombreCompletoPresentacion).HasMaxLength(100);
            entity.Property(e => e.NombrePresentacion).HasMaxLength(100);

        });

        modelBuilder.Entity<CategoriaxUnidad>(entity =>
        {
            entity.HasKey(e => new { e.CategoriaId, e.UnidadId }).HasName("PRIMARY");

            entity.ToTable("categoriaxunidad");

            entity.HasIndex(e => e.UnidadId, "UnidadID");

            entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
            entity.Property(e => e.UnidadId).HasColumnName("UnidadID");
            entity.Property(e => e.EstadoCategoria).HasColumnType("bit(1)");
            entity.Property(e => e.EstadoUnidad).HasColumnType("bit(1)");
            entity.Property(e => e.NombreCategoria).HasMaxLength(100);
            entity.Property(e => e.NombreCompletoUnidad).HasMaxLength(100);
            entity.Property(e => e.NombreUnidad).HasMaxLength(50);

        });

        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(e => e.CategoriaId).HasName("PRIMARY");

            entity.ToTable("categoria");

            entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
            entity.Property(e => e.EstadoCategoria)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.NombreCategoria).HasMaxLength(100);
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.ClienteId).HasName("PRIMARY");

            entity.ToTable("cliente");

            entity.Property(e => e.ClienteId).HasColumnName("ClienteID");
            entity.Property(e => e.Correo).HasMaxLength(100);
            entity.Property(e => e.Direccion).HasMaxLength(200);
            entity.Property(e => e.EstadoCliente)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.Identificacion).HasMaxLength(100);
            entity.Property(e => e.NombreCompleto).HasMaxLength(100);
            entity.Property(e => e.NombreEntidad)
                .HasMaxLength(100)
                .HasDefaultValueSql("'N/A u No aplica'");
            entity.Property(e => e.Telefono).HasMaxLength(20);
            entity.Property(e => e.TipoCliente).HasMaxLength(100);
        });

        modelBuilder.Entity<Compra>(entity =>
        {
            entity.HasKey(e => e.CompraId).HasName("PRIMARY");

            entity.ToTable("compras");

            entity.HasIndex(e => e.ProveedorId, "ProveedorID");

            entity.Property(e => e.CompraId).HasColumnName("CompraID");
            entity.Property(e => e.EstadoCompra)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.FechaCompra)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.NumeroFactura)
                .HasMaxLength(20)
                .HasColumnName("Numero_factura");
            entity.Property(e => e.ProveedorId).HasColumnName("ProveedorID");
            entity.Property(e => e.ValorTotalCompra).HasColumnType("mediumtext");

            entity.HasOne(d => d.Proveedor).WithMany(p => p.Compras)
                .HasForeignKey(d => d.ProveedorId)
                .HasConstraintName("compras_ibfk_1");
        });

        modelBuilder.Entity<Detallecompra>(entity =>
        {
            entity.HasKey(e => e.DetalleCompraId).HasName("PRIMARY");

            entity.ToTable("detallecompras");

            entity.HasIndex(e => e.CompraId, "CompraID");

            entity.Property(e => e.DetalleCompraId).HasColumnName("DetalleCompraID");
            entity.Property(e => e.CompraId).HasColumnName("CompraID");

            entity.HasOne(d => d.Compra).WithMany(p => p.Detallecompras)
                .HasForeignKey(d => d.CompraId)
                .HasConstraintName("detallecompras_ibfk_1");
        });

        modelBuilder.Entity<Detallepedido>(entity =>
        {
            entity.HasKey(e => e.DetallePedidoId).HasName("PRIMARY");

            entity.ToTable("detallepedido");

            entity.HasIndex(e => e.LoteId, "LoteID");

            entity.HasIndex(e => e.PedidoId, "PedidoID");

            entity.HasIndex(e => e.ProductoId, "ProductoID");

            entity.HasIndex(e => e.UnidadId, "UnidadID");

            entity.Property(e => e.DetallePedidoId).HasColumnName("DetallePedidoID");
            entity.Property(e => e.LoteId).HasColumnName("LoteID");
            entity.Property(e => e.PedidoId).HasColumnName("PedidoID");
            entity.Property(e => e.ProductoId).HasColumnName("ProductoID");
            entity.Property(e => e.UnidadId).HasColumnName("UnidadID");

            entity.HasOne(d => d.Lote).WithMany(p => p.Detallepedidos)
                .HasForeignKey(d => d.LoteId)
                .HasConstraintName("detallepedido_ibfk_4");

            entity.HasOne(d => d.Pedido).WithMany(p => p.Detallepedidos)
                .HasForeignKey(d => d.PedidoId)
                .HasConstraintName("detallepedido_ibfk_2");

            entity.HasOne(d => d.Producto).WithMany(p => p.Detallepedidos)
                .HasForeignKey(d => d.ProductoId)
                .HasConstraintName("detallepedido_ibfk_1");

            entity.HasOne(d => d.Unidad).WithMany(p => p.Detallepedidos)
                .HasForeignKey(d => d.UnidadId)
                .HasConstraintName("detallepedido_ibfk_3");
        });

        modelBuilder.Entity<Domicilio>(entity =>
        {
            entity.HasKey(e => e.DomicilioId).HasName("PRIMARY");

            entity.ToTable("domicilio");

            entity.HasIndex(e => e.PedidoId, "PedidoID");

            entity.HasIndex(e => e.UsuarioId, "UsuarioID");

            entity.Property(e => e.DomicilioId).HasColumnName("DomicilioID");
            entity.Property(e => e.DireccionDomiciliario).HasMaxLength(200);
            entity.Property(e => e.EstadoDomicilio)
                .HasMaxLength(20)
                .HasDefaultValueSql("'Pendiente'");
            entity.Property(e => e.FechaEntrega)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.Observacion).HasMaxLength(200);
            entity.Property(e => e.PedidoId).HasColumnName("PedidoID");
            entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");

            entity.HasOne(d => d.Pedido).WithMany(p => p.Domicilios)
                .HasForeignKey(d => d.PedidoId)
                .HasConstraintName("domicilio_ibfk_1");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Domicilios)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("domicilio_ibfk_2");
        });

        modelBuilder.Entity<Lote>(entity =>
        {
            entity.HasKey(e => e.LoteId).HasName("PRIMARY");

            entity.ToTable("lote");

            entity.HasIndex(e => e.DetalleCompraId, "DetalleCompraID");

            entity.HasIndex(e => e.ProductoId, "ProductoID");

            entity.HasIndex(e => e.UnidadId, "UnidadID");

            entity.Property(e => e.LoteId).HasColumnName("LoteID");
            entity.Property(e => e.DetalleCompraId).HasColumnName("DetalleCompraID");
            entity.Property(e => e.EstadoLote)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.FechaVencimiento).HasColumnType("date");
            entity.Property(e => e.NumeroLote).HasMaxLength(20);
            entity.Property(e => e.ProductoId).HasColumnName("ProductoID");
            entity.Property(e => e.UnidadId).HasColumnName("UnidadID");

            entity.HasOne(d => d.DetalleCompra).WithMany(p => p.Lotes)
                .HasForeignKey(d => d.DetalleCompraId)
                .HasConstraintName("lote_ibfk_2");

            entity.HasOne(d => d.Producto).WithMany(p => p.Lotes)
                .HasForeignKey(d => d.ProductoId)
                .HasConstraintName("lote_ibfk_1");

            entity.HasOne(d => d.Unidad).WithMany(p => p.Lotes)
                .HasForeignKey(d => d.UnidadId)
                .HasConstraintName("lote_ibfk_3");
        });

        modelBuilder.Entity<Marca>(entity =>
        {
            entity.HasKey(e => e.MarcaId).HasName("PRIMARY");

            entity.ToTable("marca");

            entity.Property(e => e.MarcaId).HasColumnName("MarcaID");
            entity.Property(e => e.EstadoMarca)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.NombreMarca).HasMaxLength(100);
        });

        modelBuilder.Entity<Movimiento>(entity =>
        {
            entity.HasKey(e => e.MovimientoId).HasName("PRIMARY");

            entity.ToTable("movimientos");

            entity.Property(e => e.MovimientoId).HasColumnName("MovimientoID");
            entity.Property(e => e.BuscarId).HasColumnName("BuscarID");
            entity.Property(e => e.FechaMovimiento)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.TipoAccion).HasMaxLength(50);
            entity.Property(e => e.TipoMovimiento).HasMaxLength(50);
        });

        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(e => e.PedidoId).HasName("PRIMARY");

            entity.ToTable("pedido");

            entity.HasIndex(e => e.ClienteId, "ClienteID");

            entity.Property(e => e.PedidoId).HasColumnName("PedidoID");
            entity.Property(e => e.ClienteId).HasColumnName("ClienteID");
            entity.Property(e => e.EstadoPedido)
                .HasMaxLength(10)
                .HasDefaultValueSql("'Pendiente'");
            entity.Property(e => e.FechaPedido)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("datetime");
            entity.Property(e => e.TipoServicio).HasMaxLength(50);
            entity.Property(e => e.ValorTotalPedido).HasPrecision(10);

            entity.HasOne(d => d.Cliente).WithMany(p => p.Pedidos)
                .HasForeignKey(d => d.ClienteId)
                .HasConstraintName("pedido_ibfk_1");
        });

        modelBuilder.Entity<Permiso>(entity =>
        {
            entity.HasKey(e => e.PermisoId).HasName("PRIMARY");

            entity.ToTable("permiso");

            entity.Property(e => e.PermisoId).HasColumnName("PermisoID");
            entity.Property(e => e.EstadoPermiso)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.NombrePermiso).HasMaxLength(100);
        });

        modelBuilder.Entity<Presentacion>(entity =>
        {
            entity.HasKey(e => e.PresentacionId).HasName("PRIMARY");

            entity.ToTable("presentacion");

            entity.Property(e => e.PresentacionId).HasColumnName("PresentacionID");
            entity.Property(e => e.Contenido).HasMaxLength(50);
            entity.Property(e => e.DescripcionPresentacion)
                .HasMaxLength(200)
                .HasDefaultValueSql("'N/A'");
            entity.Property(e => e.EstadoPresentacion)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.NombreCompletoPresentacion).HasMaxLength(100);
            entity.Property(e => e.NombrePresentacion).HasMaxLength(100);
        });

        modelBuilder.Entity<Producto>(entity =>
        {
            entity.HasKey(e => e.ProductoId).HasName("PRIMARY");

            entity.ToTable("productos");

            entity.HasIndex(e => e.CategoriaId, "CategoriaID");

            entity.HasIndex(e => e.MarcaId, "MarcaID");

            entity.HasIndex(e => e.PresentacionId, "PresentacionID");

            entity.Property(e => e.ProductoId).HasColumnName("ProductoID");
            entity.Property(e => e.AplicarFechaDeVencimiento).HasMaxLength(2);
            entity.Property(e => e.CantidadAplicarPorMayor).HasDefaultValueSql("'0'");
            entity.Property(e => e.CantidadPorUnidadReservada).HasDefaultValueSql("'0'");
            entity.Property(e => e.CantidadReservada).HasDefaultValueSql("'0'");
            entity.Property(e => e.CantidadTotal).HasDefaultValueSql("'0'");
            entity.Property(e => e.CantidadTotalPorUnidad).HasDefaultValueSql("'0'");
            entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");
            entity.Property(e => e.DescuentoAplicarPorMayor).HasDefaultValueSql("'0'");
            entity.Property(e => e.Estado)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.MarcaId).HasColumnName("MarcaID");
            entity.Property(e => e.NombreCompletoProducto).HasMaxLength(150);
            entity.Property(e => e.NombreProducto).HasMaxLength(100);
            entity.Property(e => e.PresentacionId).HasColumnName("PresentacionID");

            entity.HasOne(d => d.Categoria).WithMany(p => p.Productos)
                .HasForeignKey(d => d.CategoriaId)
                .HasConstraintName("productos_ibfk_3");

            entity.HasOne(d => d.Marca).WithMany(p => p.Productos)
                .HasForeignKey(d => d.MarcaId)
                .HasConstraintName("productos_ibfk_2");

            entity.HasOne(d => d.Presentacion).WithMany(p => p.Productos)
                .HasForeignKey(d => d.PresentacionId)
                .HasConstraintName("productos_ibfk_1");
        });

        modelBuilder.Entity<Proveedor>(entity =>
        {
            entity.HasKey(e => e.ProveedorId).HasName("PRIMARY");

            entity.ToTable("proveedor");

            entity.Property(e => e.ProveedorId).HasColumnName("ProveedorID");
            entity.Property(e => e.Correo).HasMaxLength(75);
            entity.Property(e => e.Direccion).HasMaxLength(200);
            entity.Property(e => e.EstadoProveedor)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.NombreContacto).HasMaxLength(100);
            entity.Property(e => e.NombreEmpresa).HasMaxLength(100);
            entity.Property(e => e.Telefono).HasMaxLength(20);
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.RolId).HasName("PRIMARY");

            entity.ToTable("rol");

            entity.Property(e => e.RolId).HasColumnName("RolID");
            entity.Property(e => e.EstadoRol)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.NombreRol).HasMaxLength(100);
        });

        modelBuilder.Entity<Rolxpermiso>(entity =>
        {
            entity.HasKey(e => e.RolxPermisoId).HasName("PRIMARY");

            entity.ToTable("rolxpermiso");

            entity.HasIndex(e => e.PermisoId, "PermisoID");

            entity.HasIndex(e => e.RolId, "RolID");

            entity.Property(e => e.RolxPermisoId).HasColumnName("RolxPermisoID");
            entity.Property(e => e.NombrePermisoxRol).HasMaxLength(100);
            entity.Property(e => e.PermisoId).HasColumnName("PermisoID");
            entity.Property(e => e.RolId).HasColumnName("RolID");

            entity.HasOne(d => d.Permiso).WithMany(p => p.Rolxpermisos)
                .HasForeignKey(d => d.PermisoId)
                .HasConstraintName("rolxpermiso_ibfk_1");

            entity.HasOne(d => d.Rol).WithMany(p => p.Rolxpermisos)
                .HasForeignKey(d => d.RolId)
                .HasConstraintName("rolxpermiso_ibfk_2");
        });

        modelBuilder.Entity<Unidad>(entity =>
        {
            entity.HasKey(e => e.UnidadId).HasName("PRIMARY");

            entity.ToTable("unidad");

            entity.Property(e => e.UnidadId).HasColumnName("UnidadID");
            entity.Property(e => e.DescripcionUnidad)
                .HasMaxLength(255)
                .HasDefaultValueSql("'N/A'");
            entity.Property(e => e.EstadoUnidad)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.NombreCompletoUnidad).HasMaxLength(100);
            entity.Property(e => e.NombreUnidad).HasMaxLength(50);
        });

        modelBuilder.Entity<UnidadxProducto>(entity =>
        {
            entity.HasKey(e => new { e.UnidadId, e.ProductoId }).HasName("PRIMARY");

            entity.ToTable("unidadxproducto");

            entity.HasIndex(e => e.ProductoId, "ProductoID");

            entity.Property(e => e.UnidadId).HasColumnName("UnidadID");
            entity.Property(e => e.ProductoId).HasColumnName("ProductoID");
            entity.Property(e => e.EstadoProducto)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.NombreCompletoProducto).HasMaxLength(100);
            entity.Property(e => e.NombreCompletoUnidad).HasMaxLength(100);

        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.UsuarioId).HasName("PRIMARY");

            entity.ToTable("usuarios");

            entity.HasIndex(e => e.RolId, "RolID");

            entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");
            entity.Property(e => e.Apellido).HasMaxLength(50);
            entity.Property(e => e.Contraseña).HasMaxLength(150);
            entity.Property(e => e.Correo).HasMaxLength(75);
            entity.Property(e => e.EstadoUsuario)
                .HasDefaultValueSql("b'1'")
                .HasColumnType("bit(1)");
            entity.Property(e => e.Nombre).HasMaxLength(50);
            entity.Property(e => e.RolId).HasColumnName("RolID");
            entity.Property(e => e.Telefono).HasMaxLength(50);
            entity.Property(e => e.Usuario1)
                .HasMaxLength(50)
                .HasColumnName("Usuario");

            entity.HasOne(d => d.Rol).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.RolId)
                .HasConstraintName("usuarios_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
