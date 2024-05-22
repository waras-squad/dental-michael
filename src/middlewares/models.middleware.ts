import {
  academicDTO,
  achievementDTO,
  certificateDTO,
  changePasswordDTO,
  createAdminDTO,
  createDoctorDTO,
  doctorScheduleDTO,
  doctorTreatmentDTO,
  experienceDTO,
  getDoctorListFilterDTO,
  updateDoctorDTO,
  validateLogin,
} from '@/validators';
import Elysia from 'elysia';

export const AuthModels = new Elysia({ name: 'Model.Auth' }).model({
  'Auth-model': validateLogin,
});

export const generalModels = new Elysia({ name: 'Model.General' }).model({
  'Change-password': changePasswordDTO,
});

export const adminModels = new Elysia({ name: 'Model.Admin.Admin' }).model({
  'Create-Admin': createAdminDTO,
});

export const doctorModels = new Elysia({ name: 'Mode.Admin.Doctor' }).model({
  'Create-doctor': createDoctorDTO,
  'Update-doctor': updateDoctorDTO,
  'Modify-academics': academicDTO,
  'Modify-experiences': experienceDTO,
  'Modify-certificates': certificateDTO,
  'Modify-achievements': achievementDTO,
  'Modify-schedules': doctorScheduleDTO,
  'Modify-treatments': doctorTreatmentDTO,
  'Get-doctor-filter': getDoctorListFilterDTO,
});
