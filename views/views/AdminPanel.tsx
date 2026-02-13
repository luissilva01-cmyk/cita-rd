import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Ban, 
  UserX, 
  Eye, 
  Filter,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { auth } from '../../services/firebase';
import {
  getPendingReports,
  getAllReports,
  markReportAsReviewed,
  getReportStats,
  toggleUserBlock,
  ReportWithDetails
} from '../../services/adminService';
import { logger } from '../../utils/logger';

type TabType = 'pending' | 'all' | 'stats';
type FilterCategory = 'all' | 'fake_profile' | 'inappropriate_content' | 'harassment' | 'spam' | 'underage' | 'other';

const CATEGORY_LABELS: Record<string, string> = {
  fake_profile: 'Perfil Falso',
  inappropriate_content: 'Contenido Inapropiado',
  harassment: 'Acoso',
  spam: 'Spam',
  underage: 'Menor de Edad',
  other: 'Otro'
};

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const { isAdmin, loading: adminLoading } = useAdmin(currentUser?.uid);

  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [reports, setReports] = useState<ReportWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewed: 0, resolved: 0 });
  const [processingReportId, setProcessingReportId] = useState<string | null>(null);

  // Verificar permisos de admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      logger.ui.warn('Usuario sin permisos de admin intentó acceder al panel');
      alert('⛔ No tienes permisos para acceder a esta página');
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  // Cargar reportes y estadísticas
  useEffect(() => {
    if (!isAdmin) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [statsData, reportsData] = await Promise.all([
          getReportStats(),
          activeTab === 'pending' ? getPendingReports() : getAllReports()
        ]);
        
        setStats(statsData);
        setReports(reportsData);
        logger.ui.success('Datos del panel de admin cargados', { 
          stats: statsData, 
          reportsCount: reportsData.length 
        });
      } catch (error) {
        logger.ui.error('Error cargando datos del panel de admin', error);
        alert('Error al cargar los datos. Por favor recarga la página.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAdmin, activeTab]);

  const handleMarkAsReviewed = async (reportId: string, action: string) => {
    if (!currentUser) return;
    
    setProcessingReportId(reportId);
    try {
      await markReportAsReviewed(reportId, currentUser.uid, action);
      logger.ui.success('Reporte marcado como revisado', { reportId, action });
      
      // Recargar reportes
      const reportsData = activeTab === 'pending' ? await getPendingReports() : await getAllReports();
      setReports(reportsData);
      
      // Actualizar estadísticas
      const statsData = await getReportStats();
      setStats(statsData);
    } catch (error) {
      logger.ui.error('Error marcando reporte como revisado', error);
      alert('Error al procesar el reporte. Inténtalo de nuevo.');
    } finally {
      setProcessingReportId(null);
    }
  };

  const handleBlockUser = async (userId: string, reportId: string) => {
    if (!currentUser) return;
    
    if (!window.confirm('¿Estás seguro de que quieres bloquear a este usuario?')) {
      return;
    }
    
    setProcessingReportId(reportId);
    try {
      await toggleUserBlock(userId, true, currentUser.uid);
      await markReportAsReviewed(reportId, currentUser.uid, 'Usuario bloqueado');
      logger.ui.success('Usuario bloqueado', { userId, reportId });
      
      // Recargar reportes
      const reportsData = activeTab === 'pending' ? await getPendingReports() : await getAllReports();
      setReports(reportsData);
      
      // Actualizar estadísticas
      const statsData = await getReportStats();
      setStats(statsData);
      
      alert('✅ Usuario bloqueado exitosamente');
    } catch (error) {
      logger.ui.error('Error bloqueando usuario', error);
      alert('Error al bloquear usuario. Inténtalo de nuevo.');
    } finally {
      setProcessingReportId(null);
    }
  };

  // Filtrar reportes por categoría
  const filteredReports = filterCategory === 'all' 
    ? reports 
    : reports.filter(r => r.category === filterCategory);

  if (adminLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <Shield className="text-rose-500" size={28} />
              <div>
                <h1 className="text-2xl font-bold">Panel de Administración</h1>
                <p className="text-sm text-slate-400">Gestión de reportes y usuarios</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Reportes</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <TrendingUp className="text-blue-500" size={32} />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.pending}</p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Revisados</p>
                <p className="text-3xl font-bold text-green-500">{stats.reviewed}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Resueltos</p>
                <p className="text-3xl font-bold">{stats.resolved}</p>
              </div>
              <CheckCircle className="text-slate-400" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Clock className="inline mr-2" size={18} />
            Pendientes ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            <Eye className="inline mr-2" size={18} />
            Todos los Reportes
          </button>
        </div>

        {/* Filter */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-slate-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <span className="text-slate-400 text-sm">
              Mostrando {filteredReports.length} de {reports.length} reportes
            </span>
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Cargando reportes...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center border border-slate-700">
            <CheckCircle className="mx-auto mb-4 text-green-500" size={48} />
            <p className="text-xl font-semibold mb-2">¡Todo limpio!</p>
            <p className="text-slate-400">No hay reportes {activeTab === 'pending' ? 'pendientes' : 'en esta categoría'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        report.status === 'pending' 
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : report.status === 'reviewed'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {report.status === 'pending' ? 'Pendiente' : report.status === 'reviewed' ? 'Revisado' : 'Resuelto'}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-500/20 text-rose-400">
                        {CATEGORY_LABELS[report.category] || report.category}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs text-slate-400">Usuario Reportado</p>
                        <p className="font-semibold">{report.reportedUserName}</p>
                        <p className="text-xs text-slate-500">{report.reportedUserId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Reportado por</p>
                        <p className="font-semibold">{report.reporterName}</p>
                        <p className="text-xs text-slate-500">{report.reporterId}</p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-slate-400 mb-1">Descripción</p>
                      <p className="text-slate-300">{report.description}</p>
                    </div>
                    
                    <p className="text-xs text-slate-500">
                      {new Date(report.timestamp).toLocaleString('es-DO', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </p>
                    
                    {report.reviewedBy && (
                      <div className="mt-3 pt-3 border-t border-slate-700">
                        <p className="text-xs text-slate-400">
                          Revisado • Acción: {report.action}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {report.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => handleMarkAsReviewed(report.id, 'Sin acción necesaria')}
                      disabled={processingReportId === report.id}
                      className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      {processingReportId === report.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Procesando...
                        </span>
                      ) : (
                        <>
                          <CheckCircle className="inline mr-2" size={16} />
                          Marcar Revisado
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleBlockUser(report.reportedUserId, report.id)}
                      disabled={processingReportId === report.id}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      {processingReportId === report.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Bloqueando...
                        </span>
                      ) : (
                        <>
                          <Ban className="inline mr-2" size={16} />
                          Bloquear Usuario
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
