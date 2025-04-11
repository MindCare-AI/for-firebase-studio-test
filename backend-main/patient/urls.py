# patient/urls.py
from django.urls import path
from patient.views.health_metric_views import HealthMetricViewSet
from patient.views.medical_history_views import MedicalHistoryViewSet
from patient.views.patient_profile_views import (
    PatientProfileViewSet,
    PublicPatientListView,
)

urlpatterns = [
    path(
        "profiles/",
        PatientProfileViewSet.as_view({"get": "list"}),
        name="patient-profile-list",
    ),
    path(
        "profiles/<uuid:unique_id>/",
        PatientProfileViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "patch": "partial_update",
                "delete": "destroy",
            }
        ),
        name="patient-profile-detail",
    ),
    path(
        "profiles/<uuid:unique_id>/appointments/",
        PatientProfileViewSet.as_view({"get": "appointments"}),
        name="patient-appointments",
    ),
    path(
        "health-metrics/",
        HealthMetricViewSet.as_view({"get": "list", "post": "create"}),
        name="health-metric-list",
    ),
    path(
        "health-metrics/<int:pk>/",
        HealthMetricViewSet.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
        name="health-metric-detail",
    ),
    path(
        "medical-history/",
        MedicalHistoryViewSet.as_view({"get": "list", "post": "create"}),
        name="medical-history-list",
    ),
    path(
        "medical-history/<int:pk>/",
        MedicalHistoryViewSet.as_view(
            {"get": "retrieve", "put": "update", "delete": "destroy"}
        ),
        name="medical-history-detail",
    ),
    path("profiles/all/", PublicPatientListView.as_view(), name="public-patient-list"),
]
