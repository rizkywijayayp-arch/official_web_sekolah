/**
 * Student Location Admin Page
 * Map view with Leaflet to track student locations
 */
import { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DashboardPageLayout } from '@/features/_global';
import { useStudentLocation } from '../hooks/useStudentLocation';
import { useSchoolProfile } from '@/features/_global/hooks/useSchoolProfile';
import { Button } from '@/core/libs';
import { Input } from '@/core/libs';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/libs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/libs';
import {
  Search,
  MapPin,
  Clock,
  RefreshCw,
  Filter,
  User,
  Phone,
  Navigation,
  Shield,
  AlertCircle,
  Loader2,
  Smartphone
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { id } from 'date-fns/locale';

// Fix Leaflet default marker icon
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Active (recent) marker - green
const activeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Inactive (old) marker - red
const inactiveIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to fit map bounds
function MapBoundsUpdater({ positions }: { positions: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map(pos => L.latLng(pos[0], pos[1])));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [positions, map]);

  return null;
}

export function StudentLocationAdmin() {
  const { data: schoolData } = useSchoolProfile();
  const { locations, isLoading, refetch } = useStudentLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [consentFilter, setConsentFilter] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Filter locations
  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      // Search filter
      if (searchQuery) {
        const name = loc.student?.name?.toLowerCase() || '';
        const nis = loc.student?.nis?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        if (!name.includes(query) && !nis.includes(query)) return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'recent' && !isRecent(loc.createdAt)) return false;
        if (statusFilter === 'old' && isRecent(loc.createdAt)) return false;
      }

      // Consent filter
      if (consentFilter === 'with-consent' && !loc.parentConsent) return false;
      if (consentFilter === 'no-consent' && loc.parentConsent) return false;

      return true;
    });
  }, [locations, searchQuery, statusFilter, consentFilter]);

  // Get marker positions for map bounds
  const mapPositions = useMemo(() => {
    return filteredLocations
      .filter(loc => loc.latitude && loc.longitude)
      .map(loc => [loc.latitude, loc.longitude] as [number, number]);
  }, [filteredLocations]);

  // Default center (Indonesia)
  const defaultCenter: [number, number] = [-6.9175, 107.6191]; // Bandung

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const withConsent = locations.filter(l => l.parentConsent).length;
    const recent = locations.filter(l => new Date(l.createdAt) > oneHourAgo).length;

    return {
      total: locations.length,
      withConsent,
      withoutConsent: locations.length - withConsent,
      recent,
    };
  }, [locations]);

  return (
    <DashboardPageLayout
      siteTitle={`Lokasi Siswa | ${schoolData?.schoolName || 'Nayaka Website'}`}
      breadcrumbs={[{ label: 'Lokasi Siswa', url: '/admin/lokasi-siswa' }]}
      title="Lokasi Siswa"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Lokasi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.withConsent}</p>
                <p className="text-xs text-gray-500">Dengan Izin Ortu</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.withoutConsent}</p>
                <p className="text-xs text-gray-500">Tanpa Izin</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.recent}</p>
                <p className="text-xs text-gray-500">Aktif 1 Jam Terakhir</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5" />
                  Peta Lokasi Siswa
                </CardTitle>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Update: {format(lastUpdate, 'HH:mm:ss')}</span>
                  <Button variant="ghost" size="sm" onClick={() => { refetch(); setLastUpdate(new Date()); }}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-[500px]">
                {isLoading && locations.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <MapContainer
                    center={mapPositions.length > 0 ? mapPositions[0] : defaultCenter}
                    zoom={12}
                    className="h-full w-full"
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mapPositions.length > 0 && <MapBoundsUpdater positions={mapPositions} />}
                    {filteredLocations
                      .filter(loc => loc.latitude && loc.longitude)
                      .map((loc) => {
                        const isRecentLoc = isRecent(loc.createdAt);
                        return (
                          <Marker
                            key={loc.id}
                            position={[loc.latitude, loc.longitude]}
                            icon={isRecentLoc ? activeIcon : inactiveIcon}
                            eventHandlers={{
                              click: () => setSelectedLocation(loc),
                            }}
                          >
                            <Popup>
                              <div className="min-w-[200px]">
                                <p className="font-bold">{loc.student?.name || 'Unknown'}</p>
                                <p className="text-sm text-gray-600">NIS: {loc.student?.nis || '-'}</p>
                                <p className="text-sm text-gray-600">Kelas: {loc.student?.class || '-'}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDistanceToNow(new Date(loc.createdAt), { addSuffix: true, locale: id })}
                                </p>
                                {loc.parentConsent && (
                                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                    Dengan Izin Ortu
                                  </span>
                                )}
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                  </MapContainer>
                )}
              </div>

              {/* Map Legend */}
              <div className="p-3 bg-gray-50 border-t flex items-center gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" className="w-4 h-4" alt="" />
                  <span>Aktif baru-baru ini</span>
                </div>
                <div className="flex items-center gap-2">
                  <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" className="w-4 h-4" alt="" />
                  <span>Tidak aktif</span>
                </div>
                <div className="text-gray-500 ml-auto">
                  {filteredLocations.length} siswa ditampilkan
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Search & List */}
        <div className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama atau NIS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Filters */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Status Aktivitas</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="recent">Aktif Baru</SelectItem>
                      <SelectItem value="old">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Izin Ortu</label>
                  <Select value={consentFilter} onValueChange={setConsentFilter}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="with-consent">Dengan Izin</SelectItem>
                      <SelectItem value="no-consent">Tanpa Izin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Daftar Siswa ({filteredLocations.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[400px] overflow-y-auto">
              {isLoading && locations.length === 0 ? (
                <div className="p-4 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Tidak ada data lokasi
                </div>
              ) : (
                <div className="divide-y">
                  {filteredLocations.slice(0, 50).map((loc) => (
                    <div
                      key={loc.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedLocation?.id === loc.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedLocation(loc)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          isRecent(loc.createdAt) ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{loc.student?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">
                            NIS: {loc.student?.nis || '-'} • {loc.student?.class || '-'}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(loc.createdAt), { addSuffix: true, locale: id })}
                            </span>
                          </div>
                        </div>
                        {loc.parentConsent && (
                          <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Student Detail */}
          {selectedLocation && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Detail Siswa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-medium">{selectedLocation.student?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">NIS</span>
                  <span>{selectedLocation.student?.nis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kelas</span>
                  <span>{selectedLocation.student?.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    isRecent(selectedLocation.createdAt)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {isRecent(selectedLocation.createdAt) ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Terakhir Aktif</span>
                  <span>{format(new Date(selectedLocation.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Izin Ortu</span>
                  <span className={selectedLocation.parentConsent ? 'text-green-600' : 'text-red-600'}>
                    {selectedLocation.parentConsent ? 'Ya' : 'Tidak'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sumber</span>
                  <span>{selectedLocation.source || 'App'}</span>
                </div>
                {selectedLocation.accuracy && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Akurasi</span>
                    <span>±{selectedLocation.accuracy}m</span>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p className="text-gray-500 text-xs mb-1">Koordinat</p>
                  <p className="text-xs font-mono">
                    {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="pb-16 sm:pb-0" />
    </DashboardPageLayout>
  );
}

// Helper function
function isRecent(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const oneHour = 60 * 60 * 1000;
  return diff < oneHour;
}
