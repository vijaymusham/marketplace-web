"use client";

import type { ReactNode } from "react";
import { Control, Controller, FieldErrors, Path, UseFormRegister } from "react-hook-form";
import { motion } from "framer-motion";
import { Field, formItem } from "@/constant/helper/TextField";
import { inputClassName } from "@/constant/helper/classesHelper";
import SelectDropdown from "./SelectDropdown";
import type { SellFormValues } from "../types/AllTypes";
import {
    bicycleBrandOptions,
    bikeBrandOptions,
    carBrands,
    commercialVehicleTypeOptions,
    conditionOptions,
    electronicsTypeOptions,
    facingOptions,
    fashionGenderOptions,
    fashionSizeOptions,
    footwearSizeOptions,
    fuelTypeOptions,
    furnitureTypeOptions,
    furnishingApiOptions,
    homeServiceTypeOptions,
    indianStateCodeOptions,
    jobTypeOptions,
    laptopBrandOptions,
    listingTypeOptions,
    materialOptions,
    mobileBrandOptions,
    ownerTypeOptions,
    petGenderOptions,
    petTypeOptions,
    projectLaunchMonthOptions,
    propertyTypeOptions,
    ramOptions,
    scooterBrandOptions,
    serviceTypeOptions,
    storageOptions,
    transmissionOptions,
    workModeOptions,
    yesNoOptions,
} from "../data/FormOptions";

export type SubFormProps = {
    control: Control<SellFormValues>;
    register: UseFormRegister<SellFormValues>;
    errors: FieldErrors<SellFormValues>;
};

type ChipOption = string | { value: string; label: string };

function normalizeChipOptions(options: ChipOption[]) {
    return options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option
    );
}

function ChoiceChips({
    label,
    name,
    options,
    control,
    error,
    required = false,
}: {
    label: string;
    name: Path<SellFormValues>;
    options: ChipOption[];
    control: Control<SellFormValues>;
    error?: string;
    required?: boolean;
}) {
    const normalized = normalizeChipOptions(options);

    return (
        <motion.div variants={formItem} className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[15px] font-semibold text-black">
                {label}
                {required && "*"}
            </label>
            <Controller
                name={name}
                control={control}
                rules={required ? { required: `${label} is required` } : undefined}
                render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                        {normalized.map((option) => {
                            const active = field.value === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => field.onChange(option.value)}
                                    className={`cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${active
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            />
            {error ? (
                <p className="text-xs font-semibold text-red-500">{error}</p>
            ) : null}
        </motion.div>
    );
}

function EmptySelect({
    data,
    label,
    name,
    control,
    error,
    required = false,
    placeholder = "Select",
}: {
    data: { value: string; label: string }[];
    label: string;
    name: Path<SellFormValues>;
    control: Control<SellFormValues>;
    error?: string;
    required?: boolean;
    placeholder?: string;
}) {
    return (
        <motion.div variants={formItem}>
            <Controller
                name={name}
                control={control}
                rules={required ? { required: `Pick a ${label}` } : undefined}
                render={({ field }) => (
                    <SelectDropdown
                        label={label}
                        required={required}
                        options={data.map((item) => ({ label: item.label, value: item.value })) ?? []}
                        value={typeof field.value === "string" ? field.value : field.value?.[0] ?? ""}
                        placeholder={placeholder}
                        error={error}
                        onChange={field.onChange}
                    />
                )}
            />
        </motion.div>
    );
}

function TextInput({
    label,
    name,
    register,
    error,
    required = false,
    placeholder,
    maxLength,
    type = "text",
    className,
}: {
    label: string;
    name: Path<SellFormValues>;
    register: UseFormRegister<SellFormValues>;
    error?: string;
    required?: boolean;
    placeholder?: string;
    maxLength?: number;
    type?: string;
    className?: string;
}) {
    return (
        <Field label={label} error={error} required={required} className={className}>
            <input
                type={type}
                maxLength={maxLength}
                placeholder={placeholder}
                className={inputClassName}
                aria-invalid={!!error}
                {...register(name, required ? { required: `${label} is required` } : undefined)}
            />
        </Field>
    );
}

function SubFormGrid({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
            {children}
        </div>
    );
}

/** Fallback when a subcategory has no extra fields. */
function EmptySubForm(_props: SubFormProps) {
    void _props;
    return null;
}

// Keep export for rare empty cases (unused in current binding map)
void EmptySubForm;

// ─── Mobiles & Tablets ───────────────────────────────────────────────────────

export function MobilePhonesForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={mobileBrandOptions}
                label="Brand"
                name="brand"
                control={control}
                required
                error={errors.brand?.message}
                placeholder="Select Brand"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="e.g. iPhone 17 Pro Max"
            />
            <ChoiceChips
                label="RAM"
                name="ram"
                control={control}
                required
                options={ramOptions}
                error={errors.ram?.message}
            />
            <ChoiceChips
                label="Storage"
                name="storage"
                control={control}
                required
                options={storageOptions}
                error={errors.storage?.message}
            />
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
            <ChoiceChips
                label="Warranty Available"
                name="warrantyAvailable"
                control={control}
                required
                options={yesNoOptions}
                error={errors.warrantyAvailable?.message}
            />
            <ChoiceChips
                label="Bill Available"
                name="billAvailable"
                control={control}
                required
                options={yesNoOptions}
                error={errors.billAvailable?.message}
            />
        </SubFormGrid>
    );
}


export function AccessoriesForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={mobileBrandOptions}
                label="Brand"
                name="brand"
                control={control}
                required
                error={errors.brand?.message}
                placeholder="Select Brand"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="e.g. Charger"
            />
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
            <ChoiceChips
                label="Warranty Available"
                name="warrantyAvailable"
                control={control}
                required
                options={yesNoOptions}
                error={errors.warrantyAvailable?.message}
            />
            <ChoiceChips
                label="Bill Available"
                name="billAvailable"
                control={control}
                required
                options={yesNoOptions}
                error={errors.billAvailable?.message}
            />
        </SubFormGrid>
    );
}

export function SmartWatchesForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <TextInput
                label="Brand"
                name="brand"
                register={register}
                required
                error={errors.brand?.message}
                placeholder="e.g. Apple"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="e.g. Watch Series 9"
            />
            <ChoiceChips
                label="Storage"
                name="storage"
                control={control}
                options={storageOptions}
                error={errors.storage?.message}
            />
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
            <ChoiceChips
                label="Warranty Available"
                name="warrantyAvailable"
                control={control}
                required
                options={yesNoOptions}
                error={errors.warrantyAvailable?.message}
            />
            <ChoiceChips
                label="Bill Available"
                name="billAvailable"
                control={control}
                required
                options={yesNoOptions}
                error={errors.billAvailable?.message}
            />
        </SubFormGrid>
    );
}

// ─── Electronics ─────────────────────────────────────────────────────────────

function ElectronicsBaseForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={electronicsTypeOptions}
                label="Category"
                name="type"
                control={control}
                required
                error={errors.type?.message}
                placeholder="Select category"
            />
            <TextInput
                label="Brand"
                name="brand"
                register={register}
                required
                error={errors.brand?.message}
                placeholder="e.g. Samsung"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="e.g. Galaxy Tab"
            />
            <TextInput
                label="Warranty"
                name="warranty"
                register={register}
                required
                error={errors.warranty?.message}
                placeholder="e.g. 6 months"
            />
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
        </SubFormGrid>
    );
}

export const TVsVideoAudioForm = ElectronicsBaseForm;
export const KitchenOtherAppliancesForm = ElectronicsBaseForm;

export function ComputersLaptopsForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Type"
                name="type"
                control={control}
                required
                options={["Laptop", "Computer/Desktop"]}
                error={errors.type?.message}
            />
            <EmptySelect
                data={laptopBrandOptions}
                label="Brand"
                name="brand"
                control={control}
                required
                error={errors.brand?.message}
                placeholder="Select Brand"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="e.g. MacBook Air M2"
            />
            <TextInput
                label="Warranty"
                name="warranty"
                register={register}
                required
                error={errors.warranty?.message}
                placeholder="e.g. 1 year"
            />
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
        </SubFormGrid>
    );
}

export const CamerasLensesForm = ElectronicsBaseForm;
export const GamesEntertainmentForm = ElectronicsBaseForm;
export const FridgesForm = ElectronicsBaseForm;
export const ComputerAccessoriesForm = ElectronicsBaseForm;
export const HardDisksPrintersMonitorsForm = ElectronicsBaseForm;
export const ACsForm = ElectronicsBaseForm;
export const WashingMachinesForm = ElectronicsBaseForm;

// ─── Furniture ───────────────────────────────────────────────────────────────

function FurnitureBaseForm({ control, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={furnitureTypeOptions}
                label="Furniture Type"
                name="furnitureType"
                control={control}
                required
                error={errors.furnitureType?.message}
                placeholder="Select type"
            />
            <EmptySelect
                data={materialOptions}
                label="Material"
                name="material"
                control={control}
                required
                error={errors.material?.message}
                placeholder="Select material"
            />
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
        </SubFormGrid>
    );
}

export const SofaDiningForm = FurnitureBaseForm;
export const BedsWardrobesForm = FurnitureBaseForm;
export const HomeDecorGardenForm = FurnitureBaseForm;
export const KidsFurnitureForm = FurnitureBaseForm;
export const OtherHouseholdItemsForm = FurnitureBaseForm;

// ─── Fashion ─────────────────────────────────────────────────────────────────

function FashionBaseForm({
    control,
    register,
    errors,
    defaultGender,
}: SubFormProps & { defaultGender?: string }) {
    return (
        <SubFormGrid>
            <TextInput
                label="Type of Wear"
                name="wear"
                register={register}
                required
                error={errors.wear?.message}
                placeholder={defaultGender ? `${defaultGender} wear` : "e.g. T-Shirt"}
            />
            <TextInput
                label="Brand"
                name="brand"
                register={register}
                required
                error={errors.brand?.message}
                placeholder="e.g. Nike"
            />
            <ChoiceChips
                label="Size"
                name="size"
                control={control}
                required
                options={fashionSizeOptions}
                error={errors.size?.message}
            />
            <ChoiceChips
                label="Gender"
                name="gender"
                control={control}
                required
                options={fashionGenderOptions}
                error={errors.gender?.message}
            />
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
        </SubFormGrid>
    );
}

export function MenForm(props: SubFormProps) {
    return <FashionBaseForm {...props} defaultGender="Men" />;
}
export function WomenForm(props: SubFormProps) {
    return <FashionBaseForm {...props} defaultGender="Women" />;
}
export function KidsForm(props: SubFormProps) {
    return <FashionBaseForm {...props} defaultGender="Kids" />;
}

export function FootwearForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <TextInput
                label="Type of Wear"
                name="wear"
                register={register}
                required
                error={errors.wear?.message}
                placeholder="e.g. Sneakers"
            />
            <TextInput
                label="Brand"
                name="brand"
                register={register}
                required
                error={errors.brand?.message}
                placeholder="e.g. Nike"
            />
            <ChoiceChips
                label="Size"
                name="size"
                control={control}
                required
                options={footwearSizeOptions}
                error={errors.size?.message}
            />
            <ChoiceChips
                label="Gender"
                name="gender"
                control={control}
                required
                options={fashionGenderOptions}
                error={errors.gender?.message}
            />
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
        </SubFormGrid>
    );
}

export function FashionAccessoriesForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <TextInput
                label="Type of Wear"
                name="wear"
                register={register}
                required
                error={errors.wear?.message}
                placeholder="e.g. Watch, Belt, Bag"
            />
            <TextInput
                label="Brand"
                name="brand"
                register={register}
                required
                error={errors.brand?.message}
                placeholder="e.g. Fossil"
            />
            <ChoiceChips
                label="Gender"
                name="gender"
                control={control}
                required
                options={fashionGenderOptions}
                error={errors.gender?.message}
            />
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
        </SubFormGrid>
    );
}

// ─── Vehicles ────────────────────────────────────────────────────────────────

export function CarsForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={carBrands}
                label="Brand"
                name="brand"
                control={control}
                required
                error={errors.brand?.message}
                placeholder="Select Brand"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="e.g. City"
            />
            <TextInput
                label="Variant"
                name="variant"
                register={register}
                required
                error={errors.variant?.message}
                placeholder="e.g. VX CVT"
            />
            <TextInput
                label="Year"
                name="year"
                register={register}
                required
                error={errors.year?.message}
                placeholder="e.g. 2020"
                type="number"
            />
            <ChoiceChips
                label="Fuel Type"
                name="fuelType"
                control={control}
                required
                options={fuelTypeOptions}
                error={errors.fuelType?.message}
            />
            <ChoiceChips
                label="Transmission"
                name="transmission"
                control={control}
                required
                options={transmissionOptions}
                error={errors.transmission?.message}
            />
            <TextInput
                label="KM driven"
                name="kmsDriven"
                register={register}
                required
                maxLength={6}
                error={errors.kmsDriven?.message}
                placeholder="e.g. 25000"
                type="number"
            />
            <ChoiceChips
                label="No. of Owners"
                name="ownerType"
                control={control}
                required
                options={ownerTypeOptions}
                error={errors.ownerType?.message}
            />
            <TextInput
                label="Insurance Valid Till"
                name="insuranceValidTill"
                register={register}
                required
                error={errors.insuranceValidTill?.message}
                placeholder="YYYY-MM-DD"
                type="date"
            />
            <EmptySelect
                data={indianStateCodeOptions}
                label="Registration State"
                name="registrationState"
                control={control}
                required
                error={errors.registrationState?.message}
                placeholder="Select state"
            />
            <TextInput
                label="Color"
                name="color"
                register={register}
                required
                error={errors.color?.message}
                placeholder="e.g. White"
            />
        </SubFormGrid>
    );
}

export function MotorcyclesForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={bikeBrandOptions}
                label="Brand"
                name="brand"
                control={control}
                required
                error={errors.brand?.message}
                placeholder="Select Brand"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="e.g. Classic 350"
            />
            <TextInput
                label="Year"
                name="year"
                register={register}
                required
                error={errors.year?.message}
                placeholder="e.g. 2020"
                type="number"
            />
            <TextInput
                label="KM driven"
                name="kmsDriven"
                register={register}
                required
                maxLength={6}
                error={errors.kmsDriven?.message}
                placeholder="e.g. 12000"
                type="number"
            />
            <ChoiceChips
                label="No. of Owners"
                name="ownerType"
                control={control}
                required
                options={ownerTypeOptions}
                error={errors.ownerType?.message}
            />
        </SubFormGrid>
    );
}

export function ScootersForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={scooterBrandOptions}
                label="Brand"
                name="brand"
                control={control}
                required
                error={errors.brand?.message}
                placeholder="Select Brand"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="e.g. Activa 6G"
            />
            <TextInput
                label="Year"
                name="year"
                register={register}
                required
                error={errors.year?.message}
                placeholder="e.g. 2020"
                type="number"
            />
            <TextInput
                label="KM driven"
                name="kmsDriven"
                register={register}
                required
                maxLength={6}
                error={errors.kmsDriven?.message}
                placeholder="e.g. 8000"
                type="number"
            />
            <ChoiceChips
                label="No. of Owners"
                name="ownerType"
                control={control}
                required
                options={ownerTypeOptions}
                error={errors.ownerType?.message}
            />
        </SubFormGrid>
    );
}

export function BicyclesForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <TextInput
                label="Year"
                name="year"
                register={register}
                required
                error={errors.year?.message}
                placeholder="e.g. 2018"
                type="number"
            />
            <EmptySelect
                data={bicycleBrandOptions}
                label="Brand"
                name="brand"
                control={control}
                required
                error={errors.brand?.message}
                placeholder="Select Brand"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                error={errors.model?.message}
                placeholder="e.g. MTB 26"
            />
        </SubFormGrid>
    );
}

export function SparePartsForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <TextInput
                label="Brand"
                name="brand"
                register={register}
                required
                error={errors.brand?.message}
                placeholder="e.g. Bosch"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="Part / model name"
            />
        </SubFormGrid>
    );
}

/** Bikes → 2-Wheeler Spare Parts (API requires brand/model/year/kmsDriven). */
export function TwoWheelerSparePartsForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <TextInput
                label="Brand"
                name="brand"
                register={register}
                required
                error={errors.brand?.message}
                placeholder="e.g. Bosch"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="Part / model name"
            />
        </SubFormGrid>
    );
}

export function CommercialOtherVehiclesForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={commercialVehicleTypeOptions}
                label="Type"
                name="type"
                control={control}
                required
                error={errors.type?.message}
                placeholder="Select Type"
            />
            <TextInput
                label="Brand"
                name="brand"
                register={register}
                required
                error={errors.brand?.message}
                placeholder="e.g. Tata"
            />
            <TextInput
                label="Model"
                name="model"
                register={register}
                required
                error={errors.model?.message}
                placeholder="e.g. Ace"
            />
            <TextInput
                label="Year"
                name="year"
                register={register}
                required
                error={errors.year?.message}
                placeholder="e.g. 2018"
                type="number"
            />
            <TextInput
                label="KM driven"
                name="kmsDriven"
                register={register}
                required
                maxLength={6}
                error={errors.kmsDriven?.message}
                placeholder="e.g. 45000"
                type="number"
            />
            <ChoiceChips
                label="No. of Owners"
                name="ownerType"
                control={control}
                required
                options={ownerTypeOptions}
                error={errors.ownerType?.message}
            />
        </SubFormGrid>
    );
}

// ─── Books & Hobbies ─────────────────────────────────────────────────────────

function BooksSportsBaseForm({ control, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            {/* <TextInput
                label="subcategory"
                name="subcategory"
                register={register}
                required
                error={errors.subcategory?.message}
                placeholder="e.g. Books, Sports Equipment, Cycling"
            /> */}
            <ChoiceChips
                label="Condition"
                name="condition"
                control={control}
                required
                options={conditionOptions}
                error={errors.condition?.message}
            />
        </SubFormGrid>
    );
}

export const BooksForm = BooksSportsBaseForm;
export const MusicalInstrumentsForm = BooksSportsBaseForm;
export const OtherHobbiesForm = BooksSportsBaseForm;

// ─── Home & Living ───────────────────────────────────────────────────────────

export const KitchenwareForm = FurnitureBaseForm;
export const LightingForm = FurnitureBaseForm;

// ─── Sports & Fitness ────────────────────────────────────────────────────────

export const GymFitnessForm = BooksSportsBaseForm;
export const SportsEquipmentForm = BooksSportsBaseForm;
export const CyclingForm = BooksSportsBaseForm;
export const OtherSportsForm = BooksSportsBaseForm;

// ─── Kids & Baby ─────────────────────────────────────────────────────────────

export function ToysForm(props: SubFormProps) {
    return <BooksSportsBaseForm {...props} />;
}
export const PramsWalkersForm = BooksSportsBaseForm;
export function KidsClothingForm(props: SubFormProps) {
    return <FashionBaseForm {...props} defaultGender="Kids" />;
}

// ─── Real Estate ─────────────────────────────────────────────────────────────

export function ForSaleHousesApartmentsForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Listing Type"
                name="listingType"
                control={control}
                required
                options={listingTypeOptions}
                error={errors.listingType?.message}
            />
            <ChoiceChips
                label="Property Type"
                name="propertyType"
                control={control}
                required
                options={[
                    "apartment", "independent_house", "villa", "plot", "farmhouse", "pg", "office", "shop"
                ]}
                error={errors.propertyType?.message}
            />
            <ChoiceChips
                label="BHK"
                name="bhk"
                control={control}
                required
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bhk?.message}
            />
            <ChoiceChips
                label="Bathrooms"
                name="bathrooms"
                control={control}
                required
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bathrooms?.message}
            />
            <ChoiceChips
                label="Furnishing"
                name="furnishing"
                control={control}
                required
                options={furnishingApiOptions}
                error={errors.furnishing?.message}
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
                type="number"
                register={register}
                required
                error={errors.superBuiltupArea?.message}
                placeholder="e.g. 1200"
            />
            <TextInput
                label="Carpet Area (sqft)"
                name="carpetArea"
                type="number"
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 950"
            />
            <TextInput
                label="Total Floors"
                name="totalFloors"
                type="number"
                register={register}
                error={errors.totalFloors?.message}
                placeholder="e.g. 10"
            />
            <TextInput
                label="Floor No"
                name="floorNo"
                type="number"
                register={register}
                error={errors.floorNo?.message}
                placeholder="e.g. 3"
            />
            <ChoiceChips
                label="Car Parking"
                name="parking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.parking?.message}
            />
            <EmptySelect
                data={facingOptions}
                label="Facing"
                name="facing"
                control={control}
                error={errors.facing?.message}
                placeholder="Select Facing"
            />
            <TextInput
                label="Project Name"
                name="projectName"
                register={register}
                maxLength={70}
                error={errors.projectName?.message}
                placeholder="Project name"
            />
        </SubFormGrid>
    );
}

export function ForRentHousesApartmentsForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Listing Type"
                name="listingType"
                control={control}
                required
                options={listingTypeOptions}
                error={errors.listingType?.message}
            />
            <ChoiceChips
                label="Property Type"
                name="propertyType"
                control={control}
                required
                options={[
                    "apartment", "independent_house", "villa", "plot", "farmhouse", "pg", "office", "shop"
                ]}
                error={errors.propertyType?.message}
            />
            <ChoiceChips
                label="BHK"
                name="bhk"
                control={control}
                required
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bhk?.message}
            />
            <ChoiceChips
                label="Bathrooms"
                name="bathrooms"
                control={control}
                required
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bathrooms?.message}
            />
            <ChoiceChips
                label="Furnishing"
                name="furnishing"
                control={control}
                required
                options={furnishingApiOptions}
                error={errors.furnishing?.message}
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
                type="number"
                register={register}
                required
                error={errors.superBuiltupArea?.message}
                placeholder="e.g. 1200"
            />
            <TextInput
                label="Carpet Area (sqft)"
                name="carpetArea"
                type="number"
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 950"
            />
            <TextInput
                label="Total Floors"
                name="totalFloors"
                type="number"
                register={register}
                error={errors.totalFloors?.message}
                placeholder="e.g. 10"
            />
            <TextInput
                label="Floor No"
                name="floorNo"
                type="number"
                register={register}
                error={errors.floorNo?.message}
                placeholder="e.g. 3"
            />
            <ChoiceChips
                label="Bachelors Allowed"
                name="bachelorsAllowed"
                control={control}
                options={["No", "Yes"]}
                error={errors.bachelorsAllowed?.message}
            />
            <TextInput
                label="Maintenance (Monthly)"
                name="maintenance"
                type="number"
                register={register}
                error={errors.maintenance?.message}
                placeholder="e.g. 2000"
            />
            <ChoiceChips
                label="Car Parking"
                name="parking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.parking?.message}
            />
            <EmptySelect
                data={facingOptions}
                label="Facing"
                name="facing"
                control={control}
                error={errors.facing?.message}
                placeholder="Select Facing"
            />
            <TextInput
                label="Project Name"
                name="projectName"
                register={register}
                maxLength={70}
                error={errors.projectName?.message}
                placeholder="Project name"
            />
        </SubFormGrid>
    );
}

export function LandsPlotsForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Listing Type"
                name="listingType"
                control={control}
                required
                options={listingTypeOptions}
                error={errors.listingType?.message}
            />
            <ChoiceChips
                label="Listed by"
                name="listedBy"
                control={control}
                options={["Builder", "Dealer", "Owner"]}
                error={errors.listedBy?.message}
            />
            <TextInput
                label="Plot Area (in square feet)"
                name="plotArea"
                type="number"
                register={register}
                required
                error={errors.plotArea?.message}
                placeholder="e.g. 1500 (in square feet)"
            />
            <TextInput
                label="Length (in feet)"
                name="length"
                type="number"
                register={register}
                error={errors.length?.message}
                placeholder="Length"
            />
            <TextInput
                label="Breadth (in feet)"
                name="breadth"
                type="number"
                register={register}
                error={errors.breadth?.message}
                placeholder="Breadth"
            />
            <EmptySelect
                data={facingOptions}
                label="Facing"
                name="facing"
                control={control}
                error={errors.facing?.message}
                placeholder="Select Facing"
            />
            <TextInput
                label="Project Name"
                name="projectName"
                register={register}
                maxLength={70}
                error={errors.projectName?.message}
                placeholder="Project name"
                className="sm:col-span-2"
            />
        </SubFormGrid>
    );
}

export function ForSaleNewProjectsPropertiesForm({
    control,
    register,
    errors,
}: SubFormProps) {
    return (
        <SubFormGrid>
            <TextInput
                label="Project Name"
                name="projectName"
                register={register}
                maxLength={70}
                error={errors.projectName?.message}
                placeholder="Project name"
                className="sm:col-span-2"
            />
            <ChoiceChips
                label="Project Type"
                name="projectType"
                control={control}
                required
                options={["Residential", "Commercial"]}
                error={errors.projectType?.message}
            />
            <ChoiceChips
                label="Project Status"
                name="projectStatus"
                control={control}
                required
                options={["New Launch", "Under Construction"]}
                error={errors.projectStatus?.message}
            />
            <EmptySelect
                data={propertyTypeOptions}
                label="Type of Property"
                name="typeOfProperty"
                control={control}
                required
                error={errors.typeOfProperty?.message}
                placeholder="Select Type"
            />
            <TextInput
                label="Carpet Area (sqft)"
                name="carpetArea"
                type="number"
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 950"
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
                type="number"
                register={register}
                required
                error={errors.superBuiltupArea?.message}
                placeholder="e.g. 1200"
            />
            <TextInput
                label="Developer/Builder Name"
                name="developerName"
                register={register}
                error={errors.developerName?.message}
                placeholder="Developer name"
            />
            <TextInput
                label="RERA Registration no"
                name="reraNo"
                register={register}
                type="number"
                error={errors.reraNo?.message}
                placeholder="RERA number"
            />
            <EmptySelect
                data={projectLaunchMonthOptions}
                label="Project launch month"
                name="projectLaunchMonth"
                control={control}
                error={errors.projectLaunchMonth?.message}
                placeholder="Select Month"
            />
            <TextInput
                label="Project launch year"
                name="projectLaunchYear"
                register={register}
                required
                type="number"
                error={errors.expectedPossessionYear?.message}
                placeholder="e.g. 2026"
            />
            <EmptySelect
                data={projectLaunchMonthOptions}
                label="Expected possession month"
                name="expectedPossessionMonth"
                control={control}
                error={errors.expectedPossessionMonth?.message}
                placeholder="Select Month"
            />
            <TextInput
                label="Expected possession year"
                name="expectedPossessionYear"
                register={register}
                required
                type="number"
                error={errors.expectedPossessionYear?.message}
                placeholder="e.g. 2026"
            />
            <TextInput
                label="Price from"
                name="priceFrom"
                register={register}
                required
                type="number"
                error={errors.priceFrom?.message}
                placeholder="e.g. 5000000"
            />
            <TextInput
                label="Price to"
                name="priceTo"
                register={register}
                type="number"
                error={errors.priceTo?.message}
                placeholder="e.g. 8000000"
            />
            <ChoiceChips
                label="Pricing type"
                name="pricingType"
                control={control}
                options={["All Inclusive", "Base Price"]}
                error={errors.pricingType?.message}
            />
            <TextInput
                label="Key Amenities"
                name="keyAmenities"
                register={register}
                error={errors.keyAmenities?.message}
                placeholder="e.g. Gym, Pool"
                className="sm:col-span-2"
            />
            <ChoiceChips
                label="No. of Towers"
                name="noOfTowers"
                control={control}
                options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]}
                error={errors.noOfTowers?.message}
            />
            <ChoiceChips
                label="No. of Floors"
                name="noOfFloors"
                control={control}
                options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]}
                error={errors.noOfFloors?.message}
            />
            <TextInput
                label="Total Units"
                name="totalUnits"
                register={register}
                type="number"
                error={errors.totalUnits?.message}
                placeholder="e.g. 200"
            />
            <EmptySelect
                data={facingOptions}
                label="Facing"
                name="facing"
                control={control}
                error={errors.facing?.message}
                placeholder="Select Facing"
            />
        </SubFormGrid>
    );
}

export function ForRentShopsOfficesForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Listing Type"
                name="listingType"
                control={control}
                required
                options={["rent"]}
                error={errors.listingType?.message}
            />
            <ChoiceChips
                label="Property Type"
                name="propertyType"
                control={control}
                required
                options={[
                    "apartment", "office", "shop"
                ]}
                error={errors.propertyType?.message}
            />
            <ChoiceChips
                label="Bathrooms"
                name="bathrooms"
                control={control}
                required
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bathrooms?.message}
            />
            <ChoiceChips
                label="Furnishing"
                name="furnishing"
                control={control}
                required
                options={furnishingApiOptions}
                error={errors.furnishing?.message}
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
                type="number"
                register={register}
                required
                error={errors.superBuiltupArea?.message}
                placeholder="e.g. 1200"
            />
            <TextInput
                label="Carpet Area (sqft)"
                name="carpetArea"
                type="number"
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 950"
            />
            <TextInput
                label="Total Floors"
                name="totalFloors"
                type="number"
                register={register}
                error={errors.totalFloors?.message}
                placeholder="e.g. 10"
            />
            <TextInput
                label="Floor No"
                name="floorNo"
                type="number"
                register={register}
                error={errors.floorNo?.message}
                placeholder="e.g. 3"
            />
            <TextInput
                label="Maintenance (Monthly)"
                name="maintenance"
                type="number"
                register={register}
                error={errors.maintenance?.message}
                placeholder="e.g. 2000"
            />
            <ChoiceChips
                label="Car Parking"
                name="parking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.parking?.message}
            />
            <EmptySelect
                data={facingOptions}
                label="Facing"
                name="facing"
                control={control}
                error={errors.facing?.message}
                placeholder="Select Facing"
            />
            <TextInput
                label="Project Name"
                name="projectName"
                register={register}
                maxLength={70}
                error={errors.projectName?.message}
                placeholder="Project name"
            />
        </SubFormGrid>
    );
}

export function ForSaleShopsOfficesForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Listing Type"
                name="listingType"
                control={control}
                required
                options={["sell"]}
                error={errors.listingType?.message}
            />
            <ChoiceChips
                label="Property Type"
                name="propertyType"
                control={control}
                required
                options={[
                    "office", "shop"
                ]}
                error={errors.propertyType?.message}
            />
            <ChoiceChips
                label="Bathrooms"
                name="bathrooms"
                control={control}
                required
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bathrooms?.message}
            />
            <ChoiceChips
                label="Furnishing"
                name="furnishing"
                control={control}
                required
                options={furnishingApiOptions}
                error={errors.furnishing?.message}
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
                type="number"
                register={register}
                required
                error={errors.superBuiltupArea?.message}
                placeholder="e.g. 1200"
            />
            <TextInput
                label="Carpet Area (sqft)"
                name="carpetArea"
                type="number"
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 950"
            />
            <TextInput
                label="Total Floors"
                name="totalFloors"
                type="number"
                register={register}
                error={errors.totalFloors?.message}
                placeholder="e.g. 10"
            />
            <TextInput
                label="Floor No"
                name="floorNo"
                type="number"
                register={register}
                error={errors.floorNo?.message}
                placeholder="e.g. 3"
            />
            <ChoiceChips
                label="Car Parking"
                name="parking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.parking?.message}
            />
            <EmptySelect
                data={facingOptions}
                label="Facing"
                name="facing"
                control={control}
                error={errors.facing?.message}
                placeholder="Select Facing"
            />
            <ChoiceChips
                label="Project Status"
                name="projectStatus"
                control={control}
                required
                options={["New Launch", "Under Construction"]}
                error={errors.projectStatus?.message}
            />
            <TextInput
                label="Project Name"
                name="projectName"
                register={register}
                maxLength={70}
                error={errors.projectName?.message}
                placeholder="Project name"
            />
        </SubFormGrid>
    );
}

export function PGGuestHousesForm({ control, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Property Type"
                name="subType"
                control={control}
                required
                options={[
                    { value: "guest_house", label: "Guest House" },
                    { value: "pg", label: "PG" },
                    { value: "roommate", label: "Roommate" },
                ]}
                error={errors.subType?.message}
            />
            <ChoiceChips
                label="Furnishing"
                name="furnishing"
                control={control}
                options={furnishingApiOptions}
                error={errors.furnishing?.message}
            />
            <ChoiceChips
                label="Listed by"
                name="listedBy"
                control={control}
                options={["Builder", "Dealer", "Owner"]}
                error={errors.listedBy?.message}
            />
            <ChoiceChips
                label="Car Parking"
                name="parking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.parking?.message}
            />
            <ChoiceChips
                label="Meals Included"
                name="mealsIncluded"
                control={control}
                options={["No", "Yes"]}
                error={errors.mealsIncluded?.message}
            />
        </SubFormGrid>
    );
}

// ─── Pet Supplies ────────────────────────────────────────────────────────────

function PetsBaseForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={petTypeOptions}
                label="Pet Type"
                name="petType"
                control={control}
                required
                error={errors.petType?.message}
                placeholder="Select pet type"
            />
            <TextInput
                label="Breed"
                name="breed"
                register={register}
                required
                error={errors.breed?.message}
                placeholder="e.g. Labrador"
            />
            <TextInput
                label="Age"
                name="age"
                register={register}
                required
                error={errors.age?.message}
                placeholder="e.g. 2 years"
            />
            <ChoiceChips
                label="Gender"
                name="gender"
                control={control}
                required
                options={petGenderOptions}
                error={errors.gender?.message}
            />
            <ChoiceChips
                label="Vaccinated"
                name="vaccinated"
                control={control}
                required
                options={yesNoOptions}
                error={errors.vaccinated?.message}
            />
        </SubFormGrid>
    );
}

export const FishesAquariumForm = PetsBaseForm;
export const PetFoodAccessoriesForm = PetsBaseForm;
export const DogsForm = PetsBaseForm;
export const OtherPetsForm = PetsBaseForm;

// ─── Services ────────────────────────────────────────────────────────────────

function ServicesBaseForm({
    control,
    register,
    errors,
    serviceOptions = serviceTypeOptions,
}: SubFormProps & {
    serviceOptions?: { value: string; label: string }[];
}) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={serviceOptions}
                label="Service Type"
                name="serviceType"
                control={control}
                required
                error={errors.serviceType?.message}
                placeholder="Select service type"
            />
            <TextInput
                label="Experience"
                name="experience"
                register={register}
                required
                error={errors.experience?.message}
                placeholder="e.g. 5 years"
            />
            <TextInput
                label="Service Area"
                name="serviceArea"
                register={register}
                required
                error={errors.serviceArea?.message}
                placeholder="e.g. Bengaluru"
                className="sm:col-span-2"
            />
        </SubFormGrid>
    );
}

export function EducationClassesForm(props: SubFormProps) {
    return <ServicesBaseForm {...props} />;
}
export function ToursTravelForm(props: SubFormProps) {
    return <ServicesBaseForm {...props} serviceOptions={serviceTypeOptions} />;
}
export function ElectronicsRepairServicesForm(props: SubFormProps) {
    return <ServicesBaseForm {...props} serviceOptions={electronicsTypeOptions} />;
}
export function HealthBeautyForm(props: SubFormProps) {
    return <ServicesBaseForm {...props} />;
}
export function HomeRenovationRepairForm(props: SubFormProps) {
    return <ServicesBaseForm {...props} serviceOptions={homeServiceTypeOptions} />;
}
export function CleaningPestControlForm(props: SubFormProps) {
    return <ServicesBaseForm {...props} />;
}
export function LegalDocumentationServicesForm(props: SubFormProps) {
    return <ServicesBaseForm {...props} />;
}
export function PackersMoversForm(props: SubFormProps) {
    return <ServicesBaseForm {...props} />;
}
export function OtherServicesForm(props: SubFormProps) {
    return <ServicesBaseForm {...props} />;
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

export function JobsForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={jobTypeOptions}
                label="Job Type"
                name="jobType"
                control={control}
                required
                error={errors.jobType?.message}
                placeholder="Select job type"
            />
            <TextInput
                label="Company Name"
                name="companyName"
                register={register}
                required
                error={errors.companyName?.message}
                placeholder="e.g. Acme Pvt Ltd"
            />
            <TextInput
                label="Salary From"
                name="salaryFrom"
                register={register}
                required
                error={errors.salaryFrom?.message}
                placeholder="e.g. 30000"
                type="number"
            />
            <TextInput
                label="Salary To"
                name="salaryTo"
                register={register}
                required
                error={errors.salaryTo?.message}
                placeholder="e.g. 50000"
                type="number"
            />
            <TextInput
                label="Experience"
                name="experience"
                register={register}
                required
                error={errors.experience?.message}
                placeholder="e.g. 2-4 years"
            />
            <TextInput
                label="Qualification"
                name="qualification"
                register={register}
                required
                error={errors.qualification?.message}
                placeholder="e.g. B.Tech"
            />
            <ChoiceChips
                label="Work Mode"
                name="workMode"
                control={control}
                required
                options={workModeOptions}
                error={errors.workMode?.message}
            />
        </SubFormGrid>
    );
}
