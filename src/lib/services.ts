import "server-only";
import { prisma } from "./prisma";
import { serializeImages, slugify } from "./utils";
import { translatePt, translatePtOptional } from "./translate";
import {
  catalogItemSchema,
  projectSchema,
  categorySchema,
  type CatalogItemInput,
  type ProjectInput,
  type CategoryInput,
} from "./validations";

// ── Catalog ───────────────────────────────────────────────────
export function listCatalogAdmin() {
  return prisma.catalogItem.findMany({
    include: { category: true },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });
}

export function getCatalogByIdAdmin(id: string) {
  return prisma.catalogItem.findUnique({ where: { id }, include: { category: true } });
}

async function uniqueSlug(
  model: "catalogItem" | "project" | "category",
  desired: string,
  ignoreId?: string
): Promise<string> {
  const base = slugify(desired) || "item";
  let slug = base;
  let n = 1;
  // @ts-expect-error dynamic model access
  while (await prisma[model].findFirst({ where: { slug, NOT: ignoreId ? { id: ignoreId } : undefined }, select: { id: true } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

async function catalogData(data: CatalogItemInput) {
  const [title, description, materials] = await Promise.all([
    translatePt(data.titlePt),
    translatePt(data.descriptionPt),
    translatePtOptional(data.materialsPt),
  ]);
  return {
    titlePt: data.titlePt,
    titleEn: title.en,
    titleFr: title.fr,
    descriptionPt: data.descriptionPt,
    descriptionEn: description.en,
    descriptionFr: description.fr,
    materialsPt: data.materialsPt ?? null,
    materialsEn: materials.en,
    materialsFr: materials.fr,
    dimensions: data.dimensions ?? null,
    images: serializeImages(data.images),
    featured: data.featured,
    published: data.published,
    order: data.order,
    categoryId: data.categoryId || null,
  };
}

export async function createCatalogItem(input: CatalogItemInput) {
  const data = catalogItemSchema.parse(input);
  const slug = await uniqueSlug("catalogItem", data.titlePt);
  return prisma.catalogItem.create({ data: { slug, ...(await catalogData(data)) } });
}

export async function updateCatalogItem(id: string, input: CatalogItemInput) {
  const data = catalogItemSchema.parse(input);
  const slug = await uniqueSlug("catalogItem", data.titlePt, id);
  return prisma.catalogItem.update({ where: { id }, data: { slug, ...(await catalogData(data)) } });
}

export function deleteCatalogItem(id: string) {
  return prisma.catalogItem.delete({ where: { id } });
}

export function setCatalogPublished(id: string, published: boolean) {
  return prisma.catalogItem.update({ where: { id }, data: { published } });
}

// ── Projects ──────────────────────────────────────────────────
export function listProjectsAdmin() {
  return prisma.project.findMany({
    include: { category: true },
    orderBy: [{ order: "asc" }, { updatedAt: "desc" }],
  });
}

export function getProjectByIdAdmin(id: string) {
  return prisma.project.findUnique({ where: { id }, include: { category: true } });
}

async function projectData(data: ProjectInput) {
  const [title, description] = await Promise.all([
    translatePt(data.titlePt),
    translatePt(data.descriptionPt),
  ]);
  return {
    titlePt: data.titlePt,
    titleEn: title.en,
    titleFr: title.fr,
    descriptionPt: data.descriptionPt,
    descriptionEn: description.en,
    descriptionFr: description.fr,
    location: data.location ?? null,
    year: data.year ?? null,
    images: serializeImages(data.images),
    featured: data.featured,
    published: data.published,
    order: data.order,
    categoryId: data.categoryId || null,
  };
}

export async function createProject(input: ProjectInput) {
  const data = projectSchema.parse(input);
  const slug = await uniqueSlug("project", data.titlePt);
  return prisma.project.create({ data: { slug, ...(await projectData(data)) } });
}

export async function updateProject(id: string, input: ProjectInput) {
  const data = projectSchema.parse(input);
  const slug = await uniqueSlug("project", data.titlePt, id);
  return prisma.project.update({ where: { id }, data: { slug, ...(await projectData(data)) } });
}

export function deleteProject(id: string) {
  return prisma.project.delete({ where: { id } });
}

export function setProjectPublished(id: string, published: boolean) {
  return prisma.project.update({ where: { id }, data: { published } });
}

// ── Categories ────────────────────────────────────────────────
export function listCategoriesAdmin() {
  return prisma.category.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
}

async function categoryNames(namePt: string) {
  const name = await translatePt(namePt);
  return { namePt, nameEn: name.en, nameFr: name.fr };
}

export async function createCategory(input: CategoryInput) {
  const data = categorySchema.parse(input);
  const slug = await uniqueSlug("category", data.namePt);
  return prisma.category.create({
    data: { slug, scope: data.scope, order: data.order, ...(await categoryNames(data.namePt)) },
  });
}

export async function updateCategory(id: string, input: CategoryInput) {
  const data = categorySchema.parse(input);
  // Keep the existing slug on update (it's referenced by catalog/project filters).
  return prisma.category.update({
    where: { id },
    data: { scope: data.scope, order: data.order, ...(await categoryNames(data.namePt)) },
  });
}

export function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
