import { lang } from "@/core/libs";
import z from "zod";

export const schoolCreationFormSchema = z
  .object({
    alamatSekolah: z.string().min(1, { message: "Alamat sekolah harus diisi" }),
    schoolName: z
      .string()
      .min(1, { message: lang.text("schoolCreationValidation1") }),
    schoolNPSN: z
      .string()
      .min(1, { message: lang.text("schoolCreationValidation2") }),
    schoolAdmin: z
      .string()
      .min(1, { message: lang.text("schoolCreationValidation3") }),
    schoolStatus: z.enum(["1", "0"]).optional(),
    schoolLogo: z.any().optional(),
    schoolFile: z.any().optional(),
    moodleApiUrl: z.string().optional(),
    tokenMoodle: z.string().optional(),
    libraryServer: z.string().optional(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    email: z
      .string()
      .min(1, { message: lang.text("schoolCreationValidation5") })
      .email({ message: lang.text("schoolCreationValidation6") }),
    confirmPassword: z.string().min(1, {
      message: lang.text("fieldIsRequired", {
        field: lang.text("confirmPassword"),
      }),
    }),
    password: z
      .string()
      .min(8, { message: lang.text("passwordValidation1") })
      .regex(/[A-Z]/, {
        message: lang.text("passwordValidation4"),
      })
      .regex(/[a-z]/, {
        message: lang.text("passwordValidation2"),
      })
      .regex(/[0-9]/, {
        message: lang.text("passwordValidation3"),
      }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: lang.text("passwordsDontMatch"),
      path: ["confirmPassword"],
    }
  );

export type SchoolCreationFormSchema = typeof schoolCreationFormSchema;

export const schoolUpdateFormSchema = z.object({
  schoolName: z
    .string()
    .min(1, { message: lang.text("schoolCreationValidation1") }),
  schoolNPSN: z
    .string()
    .min(1, { message: lang.text("schoolCreationValidation2") }),
  schoolAdmin: z.string().optional(),
  schoolStatus: z.enum(["1", "0"]).optional(),
  provinceId: z.string().optional(),
  moodleApiUrl: z.string().optional(),
  tokenMoodle: z.string().optional(),
  serverSatu: z.string().optional(),
  serverDua: z.string().optional(),
  serverTiga: z.string().optional(),
  file: z.any().optional(),
  favicon: z.any().optional(), // Favicon upload field
  urlYoutube1: z.string().optional(),
  urlYoutube2: z.string().optional(),
  urlYoutube3: z.string().optional(),
  libraryServer: z.string().optional(),
  libraryName: z.string().optional(),
  address: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  active: z.number(),
  alamatSekolah: z.string().optional(),
  vision: z.string().optional(),
  missions: z.string().optional(),
  visiMisi: z.string().optional(),
});
