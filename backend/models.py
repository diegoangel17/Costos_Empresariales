from extensions import db
from datetime import datetime

class TipoRegistro(db.Model):
    __tablename__ = 'tipos_registro'
    id = db.Column(db.Integer, primary_key=True)
    clasificacion = db.Column(db.String(50), nullable=False, unique=True)

    def to_json(self):
        return {'id': self.id, 'clasificacion': self.clasificacion}

class Registro(db.Model):
    
    __tablename__ = 'registros'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False) # Columna solicitada
    
    # Foreign Key hacia Tipo de Registro
    id_tipo_registro = db.Column(db.Integer, db.ForeignKey('tipos_registro.id'), nullable=False)
    
    # Relaciones
    tipo = db.relationship('TipoRegistro', backref='registros')
    # Esta relación permite acceder a todos los movimientos de este registro (registro.movimientos)
    movimientos = db.relationship('MovimientoCuenta', backref='registro', lazy=True)

    def to_json(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'tipo': self.tipo.clasificacion,
            # Opcional: devolver cuántos movimientos tiene
            'total_movimientos': len(self.movimientos) 
        }

class ClasificacionCuenta(db.Model):
    __tablename__ = 'clasificaciones_cuentas'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False, unique=True)

    def to_json(self):
        return {'id': self.id, 'nombre': self.nombre}

class Cuenta(db.Model):
    __tablename__ = 'cuentas'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    id_clasificacion = db.Column(db.Integer, db.ForeignKey('clasificaciones_cuentas.id'), nullable=False)
    clasificacion = db.relationship('ClasificacionCuenta', backref='cuentas')

    def to_json(self):
        return {'id': self.id, 'nombre': self.nombre, 'clasificacion': self.clasificacion.nombre}

class Orden(db.Model):
    __tablename__ = 'ordenes'
    id = db.Column(db.Integer, primary_key=True)
    descripcion = db.Column(db.String(100), nullable=False)
    
    movimientos = db.relationship('MovimientoCuenta', backref='orden', lazy=True)
    producciones = db.relationship('Produccion', backref='orden', lazy=True)

    def to_json(self):
        return {'id': self.id, 'descripcion': self.descripcion}

class MovimientoCuenta(db.Model):
    __tablename__ = 'movimientos_cuentas'
    id = db.Column(db.Integer, primary_key=True)
    
    # Foreign Keys
    id_cuenta = db.Column(db.Integer, db.ForeignKey('cuentas.id'), nullable=False)
    id_orden = db.Column(db.Integer, db.ForeignKey('ordenes.id'), nullable=True) # Puede ser Null si es un gasto general
    
    # --- NUEVO CAMPO DE VINCULACIÓN ---
    # Vinculamos el movimiento a un Registro Padre
    id_registro = db.Column(db.Integer, db.ForeignKey('registros.id'), nullable=False)
    
    monto = db.Column(db.Float, nullable=False)
    detalle = db.Column(db.String(200))
    fecha = db.Column(db.DateTime, default=datetime.utcnow)

    def to_json(self):
        return {
            'id': self.id,
            'registro': self.registro.nombre, # Podemos ver a qué registro pertenece
            'cuenta': self.cuenta.nombre,
            'monto': self.monto,
            'detalle': self.detalle,
            'fecha': self.fecha.isoformat()
        }

class Producto(db.Model):
    __tablename__ = 'productos'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    def to_json(self):
        return {'id': self.id, 'nombre': self.nombre}

class Produccion(db.Model):
    __tablename__ = 'producciones'
    id = db.Column(db.Integer, primary_key=True)
    id_orden = db.Column(db.Integer, db.ForeignKey('ordenes.id'), nullable=False)
    id_producto = db.Column(db.Integer, db.ForeignKey('productos.id'), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    fecha_inicio = db.Column(db.DateTime, default=datetime.utcnow)
    fecha_final = db.Column(db.DateTime, nullable=True)
    costo_materiales = db.Column(db.Float, default=0.0)
    costo_mo = db.Column(db.Float, default=0.0)
    costo_gif = db.Column(db.Float, default=0.0)

    @property
    def costo_total(self):
        return self.costo_materiales + self.costo_mo + self.costo_gif

    def to_json(self):
        return {
            'id': self.id,
            'producto': self.producto.nombre if hasattr(self, 'producto') else self.id_producto,
            'cantidad': self.cantidad,
            'total': self.costo_total
        }

class Inventario(db.Model):
    __tablename__ = 'inventario'
    id = db.Column(db.Integer, primary_key=True)
    id_producto = db.Column(db.Integer, db.ForeignKey('productos.id'), nullable=False)
    unidades = db.Column(db.Integer, default=0)
    precio_unitario = db.Column(db.Float, default=0.0)

    @property
    def valor_total(self):
        return self.unidades * self.precio_unitario

    def to_json(self):
        return {
            'id': self.id,
            'unidades': self.unidades,
            'precio': self.precio_unitario,
            'valor_total': self.valor_total
        }