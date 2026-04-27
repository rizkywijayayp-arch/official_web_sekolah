/**
 * Student Location Map - Enterprise Edition
 * Professional, detailed tracking system with comprehensive features
 */
import { Card, CardContent, Input, Button, Badge } from "@/core/libs";
import { useStudentLocation } from "@/features/student-location/hooks/useStudentLocation";
import { useSchoolProfile } from "@/features/_global/hooks/useSchoolProfile";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo, useState, useCallback, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import {
  Search,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldX,
  Clock,
  User,
  X,
  MapPin,
  Smartphone,
  Navigation,
  Filter,
  ChevronRight,
  Eye,
  ExternalLink,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";
import { id } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/libs";

// Custom marker icons - Enterprise style
const createMarkerIcon = (type: "active" | "consent" | "no-consent") => {
  const colors = {
    active: { bg: "#10b981", glow: "0 0 8px #10b981" },
    consent: { bg: "#8b5cf6", glow: "0 0 6px #8b5cf6" },
    "no-consent": { bg: "#ef4444", glow: "none" },
  };
  const c = colors[type];
  return L.divIcon({
    className: "student-marker",
    html: `<div style="
      width: 14px;
      height: 14px;
      background: ${c.bg};
      border-radius: 50%;
      border: 2.5px solid #fff;
      box-shadow: ${c.glow}, 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
};

const greenIcon = createMarkerIcon("active");
const purpleIcon = createMarkerIcon("consent");
const redIcon = createMarkerIcon("no-consent");

// Map bounds handler
function MapBoundsHandler({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useMemo(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions.map((p) => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [positions, map]);
  return null;
}

// Helper functions
function isRecent(dateString: string): boolean {
  return new Date().getTime() - new Date(dateString).getTime() < 60 * 60 * 1000;
}

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isToday(date)) return `Hari ini, ${format(date, "HH:mm")}`;
  if (isYesterday(date)) return `Kemarin, ${format(date, "HH:mm")}`;
  return format(date, "dd MMM yyyy, HH:mm", { locale: id });
}

// Component
export const StudentLocationMap = () => {
  const { data: schoolData } = useSchoolProfile();
  const { locations, isLoading, refetch } = useStudentLocation();
  const mapRef = useRef<L.Map | null>(null);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [consentFilter, setConsentFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Filtered data
  const filteredLocations = useMemo(() => {
    return locations.filter((loc: any) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !loc.student?.name?.toLowerCase().includes(q) &&
          !loc.student?.nis?.toLowerCase().includes(q) &&
          !loc.student?.class?.toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter === "recent" && !isRecent(loc.createdAt)) return false;
      if (statusFilter === "old" && isRecent(loc.createdAt)) return false;
      if (consentFilter === "with-consent" && !loc.parentConsent) return false;
      if (consentFilter === "no-consent" && loc.parentConsent) return false;
      return true;
    });
  }, [locations, searchQuery, statusFilter, consentFilter]);

  // Statistics
  const stats = useMemo(() => {
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const active = locations.filter((l: any) => new Date(l.createdAt) > hourAgo).length;
    const todayActive = locations.filter((l: any) => isToday(new Date(l.createdAt))).length;
    const consent = locations.filter((l: any) => l.parentConsent).length;
    const noConsent = locations.filter((l: any) => !l.parentConsent).length;

    return { total: locations.length, active, todayActive, consent, noConsent };
  }, [locations]);

  // Map config
  const mapPositions = useMemo(() => {
    return filteredLocations
      .filter((l: any) => l.latitude && l.longitude)
      .map((l: any) => [l.latitude, l.longitude] as [number, number]);
  }, [filteredLocations]);

  const mapCenter = useMemo((): [number, number] => {
    if (mapPositions.length > 0) return mapPositions[0];
    return [schoolData?.latitude || -6.9175, schoolData?.longitude || 107.6191];
  }, [mapPositions, schoolData]);

  const getMarkerIcon = useCallback((loc: any) => {
    if (isRecent(loc.createdAt)) return greenIcon;
    return loc.parentConsent ? purpleIcon : redIcon;
  }, []);

  const selectedLocation = useMemo(
    () => filteredLocations.find((l: any) => l.id === selectedId),
    [filteredLocations, selectedId]
  );

  // Focus on selected location
  const focusLocation = useCallback((loc: any) => {
    if (loc && loc.latitude && loc.longitude && mapRef.current) {
      mapRef.current.flyTo([loc.latitude, loc.longitude], 16, { duration: 0.5 });
    }
  }, []);

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-300 uppercase tracking-wider">Total Siswa</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-100 uppercase tracking-wider">Aktif 1 Jam</p>
                <p className="text-2xl font-bold mt-1">{stats.active}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-100 uppercase tracking-wider">Aktif Hari Ini</p>
                <p className="text-2xl font-bold mt-1">{stats.todayActive}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-100 uppercase tracking-wider">Dengan Izin</p>
                <p className="text-2xl font-bold mt-1">{stats.consent}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-100 uppercase tracking-wider">Tanpa Izin</p>
                <p className="text-2xl font-bold mt-1">{stats.noConsent}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <ShieldX className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari nama, NIS, atau kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-gray-50 border-gray-200"
              />
            </div>

            <div className="h-8 w-px bg-gray-200 hidden md:block" />

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-10 bg-gray-50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="recent">Aktif Baru</SelectItem>
                  <SelectItem value="old">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>

              <Select value={consentFilter} onValueChange={setConsentFilter}>
                <SelectTrigger className="w-[150px] h-10 bg-gray-50">
                  <SelectValue placeholder="Izin Ortu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Izin</SelectItem>
                  <SelectItem value="with-consent">Dengan Izin</SelectItem>
                  <SelectItem value="no-consent">Tanpa Izin</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "map"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Peta
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-purple-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Navigation className="w-4 h-4 inline mr-1" />
                  Daftar
                </button>
              </div>
            </div>

            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refetch();
                  setLastUpdate(new Date());
                }}
                className="h-10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <span className="text-xs text-gray-400">
                Update: {format(lastUpdate, "HH:mm:ss")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map / List View */}
        <div className={viewMode === "map" ? "lg:col-span-3" : "lg:col-span-4"}>
          <Card>
            <CardContent className="p-0">
              {viewMode === "map" ? (
                <div className="relative h-[480px] rounded-lg overflow-hidden">
                  {isLoading && locations.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
                      <div className="text-center">
                        <div className="w-12 h-12 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-sm text-gray-500 mt-3">Memuat lokasi siswa...</p>
                      </div>
                    </div>
                  )}

                  <MapContainer
                    ref={mapRef}
                    center={mapCenter}
                    zoom={13}
                    className="h-full w-full"
                    scrollWheelZoom={true}
                    attributionControl={false}
                    zoomControl={true}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      subdomains="a|b|c"
                    />
                    {mapPositions.length > 0 && <MapBoundsHandler positions={mapPositions} />}

                    {filteredLocations
                      .filter((l: any) => l.latitude && l.longitude)
                      .slice(0, 150)
                      .map((loc: any) => (
                        <Marker
                          key={loc.id}
                          position={[loc.latitude, loc.longitude]}
                          icon={getMarkerIcon(loc)}
                          eventHandlers={{
                            click: () => {
                              setSelectedId(loc.id === selectedId ? null : loc.id);
                              if (loc.id !== selectedId) {
                                setTimeout(() => focusLocation(loc), 100);
                              }
                            },
                          }}
                        >
                          <Popup className="student-popup">
                            <div className="p-3 min-w-[220px]">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-base">{loc.student?.name || "?"}</span>
                                <Badge
                                  variant={isRecent(loc.createdAt) ? "success" : "secondary"}
                                  className="text-xs"
                                >
                                  {isRecent(loc.createdAt) ? "Aktif" : "Tidak Aktif"}
                                </Badge>
                              </div>

                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">NIS:</span>
                                  <span className="font-medium">{loc.student?.nis || "-"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Kelas:</span>
                                  <span className="font-medium">{loc.student?.class || "-"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500">Terakhir:</span>
                                  <span className="text-xs">{formatRelativeDate(loc.createdAt)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-500">Izin Ortu:</span>
                                  {loc.parentConsent ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                  )}
                                </div>
                              </div>

                              <div className="mt-3 pt-2 border-t flex items-center gap-2">
                                <a
                                  href={`https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Google Maps
                                </a>
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                  </MapContainer>

                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg z-[1000] border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Legenda</p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                        <span>Aktif (&lt;1 jam)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span>Non-aktif (izin)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span>Non-aktif</span>
                      </div>
                    </div>
                  </div>

                  {/* Result Count */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md z-[1000] text-sm">
                    <span className="font-medium text-purple-600">{filteredLocations.length}</span> siswa
                    ditampilkan
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="p-4 max-h-[480px] overflow-y-auto">
                  {filteredLocations.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Tidak ada data lokasi yang cocok</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredLocations.map((loc: any) => (
                        <div
                          key={loc.id}
                          onClick={() => {
                            setSelectedId(loc.id);
                            setViewMode("map");
                            setTimeout(() => focusLocation(loc), 100);
                          }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                            selectedId === loc.id
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-100 hover:border-purple-200"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                isRecent(loc.createdAt) ? "bg-emerald-500" : "bg-red-500"
                              }`}
                            />
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                              {loc.student?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{loc.student?.name || "?"}</p>
                              <p className="text-sm text-gray-500">
                                {loc.student?.nis || "-"} • {loc.student?.class || "-"}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs text-gray-400">
                                {formatRelativeDate(loc.createdAt)}
                              </p>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                {loc.parentConsent ? (
                                  <ShieldCheck className="w-4 h-4 text-green-500" />
                                ) : (
                                  <ShieldX className="w-4 h-4 text-amber-500" />
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Selected Detail Panel */}
        {selectedLocation && (
          <Card className="lg:col-span-1 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Detail Siswa</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedId(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Avatar */}
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mx-auto">
                    {selectedLocation.student?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <h3 className="text-xl font-bold mt-3">{selectedLocation.student?.name || "?"}</h3>
                  <p className="text-gray-500">{selectedLocation.student?.class || "-"}</p>
                </div>

                {/* Status Badge */}
                <div className="flex justify-center gap-2">
                  <Badge
                    variant={isRecent(selectedLocation.createdAt) ? "success" : "secondary"}
                    className="text-sm px-3 py-1"
                  >
                    {isRecent(selectedLocation.createdAt) ? "Aktif Baru" : "Tidak Aktif"}
                  </Badge>
                  {selectedLocation.parentConsent ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Izin Ortu
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                      <ShieldX className="w-3 h-3 mr-1" />
                      Tanpa Izin
                    </Badge>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">NIS</span>
                    <span className="font-medium">{selectedLocation.student?.nis || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Kelas</span>
                    <span className="font-medium">{selectedLocation.student?.class || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Terakhir Aktif</span>
                    <span className="font-medium text-xs">
                      {format(new Date(selectedLocation.createdAt), "dd MMM yyyy, HH:mm", { locale: id })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sumber</span>
                    <span className="font-medium capitalize">{selectedLocation.source || "App"}</span>
                  </div>
                  {selectedLocation.accuracy && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Akurasi</span>
                      <span className="font-medium">±{selectedLocation.accuracy}m</span>
                    </div>
                  )}
                </div>

                {/* Coordinates */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Koordinat</p>
                  <p className="text-xs font-mono">
                    {selectedLocation.latitude?.toFixed(6)}, {selectedLocation.longitude?.toFixed(6)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setViewMode("map");
                      focusLocation(selectedLocation);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Lihat di Peta
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    as="a"
                    href={`https://www.google.com/maps?q=${selectedLocation.latitude},${selectedLocation.longitude}`}
                    target="_blank"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Missing Users icon
function Users({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
