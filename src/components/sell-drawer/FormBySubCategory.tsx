"use client";

import type { ReactNode } from "react";
import { Control, Controller, FieldErrors, Path, UseFormRegister } from "react-hook-form";
import { motion } from "framer-motion";
import { Field, formItem } from "@/constant/helper/TextField";
import { inputClassName } from "@/constant/helper/classesHelper";
import SelectDropdown from "./SelectDropdown";
import type { SellFormValues } from "../types/AllTypes";
import { bicycleBrandOptions, bikeBrandOptions, carBrands, commercialVehicleTypeOptions, facingOptions, laptopBrandOptions, mobileBrandOptions, projectLaunchMonthOptions, propertyTypeOptions, scooterBrandOptions } from "../data/FormOptions";

export type SubFormProps = {
    control: Control<SellFormValues>;
    register: UseFormRegister<SellFormValues>;
    errors: FieldErrors<SellFormValues>;
};

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
    options: string[];
    control: Control<SellFormValues>;
    error?: string;
    required?: boolean;
}) {
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
                        {options.map((option) => {
                            const active = field.value === option;
                            return (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => field.onChange(option)}
                                    className={`cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${active
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                                        }`}
                                >
                                    {option}
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
                        value={field.value ?? ""}
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

/** No subcategory-specific fields in the PDF / form. */
function EmptySubForm(_props: SubFormProps) {
    void _props;
    return null;
}

// ─── Mobiles & Tablets ───────────────────────────────────────────────────────

export function MobilePhonesForm({ control, errors }: SubFormProps) {
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
        </SubFormGrid>
    );
}

export function TabletsForm({ control, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Type"
                name="type"
                control={control}
                required
                options={["iPads", "Samsung", "Other Tablets"]}
                error={errors.type?.message}
            />
        </SubFormGrid>
    );
}

export function AccessoriesForm({ control, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Type"
                name="type"
                control={control}
                required
                options={["Mobile", "Tablets"]}
                error={errors.type?.message}
            />
        </SubFormGrid>
    );
}

export const SmartWatchesForm = EmptySubForm;

// ─── Electronics ─────────────────────────────────────────────────────────────

export const TVsVideoAudioForm = EmptySubForm;
export const KitchenOtherAppliancesForm = EmptySubForm;

export function ComputersLaptopsForm({ control, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Type"
                name="type"
                control={control}
                options={["Laptop", "Computer/Desktop"]}
                error={errors.type?.message}
            />
            <EmptySelect
                data={laptopBrandOptions}
                label="Brand"
                name="brand"
                control={control}
                error={errors.brand?.message}
                placeholder="Select Brand"
            />
        </SubFormGrid>
    );
}

export const CamerasLensesForm = EmptySubForm;
export const GamesEntertainmentForm = EmptySubForm;
export const FridgesForm = EmptySubForm;
export const ComputerAccessoriesForm = EmptySubForm;
export const HardDisksPrintersMonitorsForm = EmptySubForm;
export const ACsForm = EmptySubForm;
export const WashingMachinesForm = EmptySubForm;

// ─── Furniture ───────────────────────────────────────────────────────────────

export const SofaDiningForm = EmptySubForm;
export const BedsWardrobesForm = EmptySubForm;
export const HomeDecorGardenForm = EmptySubForm;
export const KidsFurnitureForm = EmptySubForm;
export const OtherHouseholdItemsForm = EmptySubForm;

// ─── Fashion ─────────────────────────────────────────────────────────────────

export const MenForm = EmptySubForm;
export const WomenForm = EmptySubForm;
export const KidsForm = EmptySubForm;

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
                label="Year"
                name="year"
                register={register}
                required
                error={errors.year?.message}
                placeholder="e.g. 2020"
            />
            <ChoiceChips
                label="Fuel"
                name="fuel"
                control={control}
                required
                options={["CNG & Hybrids", "Diesel", "Electric", "LPG", "Petrol"]}
                error={errors.fuel?.message}
            />
            <ChoiceChips
                label="Transmission"
                name="transmission"
                control={control}
                required
                options={["Automatic", "Manual"]}
                error={errors.transmission?.message}
            />
            <TextInput
                label="KM driven"
                name="kmDriven"
                register={register}
                required
                maxLength={6}
                error={errors.kmDriven?.message}
                placeholder="e.g. 25000"
            />
            <ChoiceChips
                label="No. of Owners"
                name="owners"
                control={control}
                required
                options={["1st", "2nd", "3rd", "4th", "4+"]}
                error={errors.owners?.message}
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
                label="Year"
                name="year"
                register={register}
                required
                error={errors.year?.message}
                placeholder="e.g. 2020"
            />
            <ChoiceChips
                label="Fuel"
                name="fuel"
                control={control}
                required
                options={["Electric", "Others", "CNG", "Hybrid", "Petrol"]}
                error={errors.fuel?.message}
            />
            <TextInput
                label="KM driven"
                name="kmDriven"
                register={register}
                required
                maxLength={6}
                error={errors.kmDriven?.message}
                placeholder="e.g. 12000"
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
                label="Year"
                name="year"
                register={register}
                required
                error={errors.year?.message}
                placeholder="e.g. 2020"
            />
            <ChoiceChips
                label="Fuel"
                name="fuel"
                control={control}
                required
                options={["Hybrid", "CNG", "Others", "Petrol", "Electric"]}
                error={errors.fuel?.message}
            />
            <TextInput
                label="KM driven"
                name="kmDriven"
                register={register}
                required
                maxLength={6}
                error={errors.kmDriven?.message}
                placeholder="e.g. 8000"
            />
        </SubFormGrid>
    );
}

export function BicyclesForm({ control, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <EmptySelect
                data={bicycleBrandOptions}
                label="Brand"
                name="brand"
                control={control}
                required
                error={errors.brand?.message}
                placeholder="Select Brand"
            />
        </SubFormGrid>
    );
}

export const SparePartsForm = EmptySubForm;

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
                label="Year"
                name="year"
                register={register}
                required
                error={errors.year?.message}
                placeholder="e.g. 2018"
            />
            <TextInput
                label="KM driven"
                name="kmDriven"
                register={register}
                required
                maxLength={6}
                error={errors.kmDriven?.message}
                placeholder="e.g. 45000"
            />
        </SubFormGrid>
    );
}

// ─── Books & Hobbies ─────────────────────────────────────────────────────────

export const BooksForm = EmptySubForm;
export const MusicalInstrumentsForm = EmptySubForm;
export const OtherHobbiesForm = EmptySubForm;

// ─── Home & Living ───────────────────────────────────────────────────────────

export const KitchenwareForm = EmptySubForm;
export const LightingForm = EmptySubForm;

// ─── Sports & Fitness ────────────────────────────────────────────────────────

export const GymFitnessForm = EmptySubForm;
export const SportsEquipmentForm = EmptySubForm;
export const CyclingForm = EmptySubForm;
export const OtherSportsForm = EmptySubForm;

// ─── Kids & Baby ─────────────────────────────────────────────────────────────

export const ToysForm = EmptySubForm;
export const PramsWalkersForm = EmptySubForm;
export const KidsClothingForm = EmptySubForm;

// ─── Real Estate ─────────────────────────────────────────────────────────────

export function ForSaleHousesApartmentsForm({ control, register, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Type"
                name="type"
                control={control}
                required
                options={[
                    "Flats / Apartments",
                    "Farm House",
                    "House & Villa",
                    "Independent / Builder Floors",
                    "Duplex",
                ]}
                error={errors.type?.message}
            />
            <ChoiceChips
                label="BHK"
                name="bhk"
                control={control}
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bhk?.message}
            />
            <ChoiceChips
                label="Bathrooms"
                name="bathrooms"
                control={control}
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bathrooms?.message}
            />
            <ChoiceChips
                label="Furnishing"
                name="furnishing"
                control={control}
                options={["Furnished", "Semi-Furnished", "Unfurnished"]}
                error={errors.furnishing?.message}
            />
            <ChoiceChips
                label="Project Status"
                name="projectStatus"
                control={control}
                options={["New Launch", "Ready to Move", "Under Construction"]}
                error={errors.projectStatus?.message}
            />
            <ChoiceChips
                label="Listed by"
                name="listedBy"
                control={control}
                options={["Builder", "Dealer", "Owner"]}
                error={errors.listedBy?.message}
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
                register={register}
                required
                error={errors.superBuiltupArea?.message}
                placeholder="e.g. 1200"
            />
            <TextInput
                label="Carpet Area (sqft)"
                name="carpetArea"
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 950"
            />
            <TextInput
                label="Maintenance (Monthly)"
                name="maintenance"
                register={register}
                error={errors.maintenance?.message}
                placeholder="e.g. 2000"
            />
            <TextInput
                label="Total Floors"
                name="totalFloors"
                register={register}
                error={errors.totalFloors?.message}
                placeholder="e.g. 10"
            />
            <TextInput
                label="Floor No"
                name="floorNo"
                register={register}
                error={errors.floorNo?.message}
                placeholder="e.g. 3"
            />
            <ChoiceChips
                label="Car Parking"
                name="carParking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.carParking?.message}
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
                label="Type"
                name="type"
                control={control}
                required
                options={[
                    "Flats / Apartments",
                    "Individual House / Villa",
                    "Independent / Builder Floors",
                    "Duplex",
                ]}
                error={errors.type?.message}
            />
            <ChoiceChips
                label="BHK"
                name="bhk"
                control={control}
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bhk?.message}
            />
            <ChoiceChips
                label="Bathrooms"
                name="bathrooms"
                control={control}
                options={["1", "2", "3", "4", "4+"]}
                error={errors.bathrooms?.message}
            />
            <ChoiceChips
                label="Furnishing"
                name="furnishing"
                control={control}
                options={["Furnished", "Semi-Furnished", "Unfurnished"]}
                error={errors.furnishing?.message}
            />
            <ChoiceChips
                label="Listed by"
                name="listedBy"
                control={control}
                options={["Builder", "Dealer", "Owner"]}
                error={errors.listedBy?.message}
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
                register={register}
                required
                error={errors.superBuiltupArea?.message}
                placeholder="e.g. 1200"
            />
            <TextInput
                label="Carpet Area (sqft)"
                name="carpetArea"
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 950"
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
                register={register}
                error={errors.maintenance?.message}
                placeholder="e.g. 2000"
            />
            <TextInput
                label="Total Floors"
                name="totalFloors"
                register={register}
                error={errors.totalFloors?.message}
                placeholder="e.g. 10"
            />
            <TextInput
                label="Floor No"
                name="floorNo"
                register={register}
                error={errors.floorNo?.message}
                placeholder="e.g. 3"
            />
            <ChoiceChips
                label="Car Parking"
                name="carParking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.carParking?.message}
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
                label="Type"
                name="type"
                control={control}
                required
                options={["For Rent", "For Sale"]}
                error={errors.type?.message}
            />
            <ChoiceChips
                label="Listed by"
                name="listedBy"
                control={control}
                options={["Builder", "Dealer", "Owner"]}
                error={errors.listedBy?.message}
            />
            <TextInput
                label="Plot Area"
                name="plotArea"
                register={register}
                required
                error={errors.plotArea?.message}
                placeholder="e.g. 1500"
            />
            <TextInput
                label="Length"
                name="length"
                register={register}
                error={errors.length?.message}
                placeholder="Length"
            />
            <TextInput
                label="Breadth"
                name="breadth"
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
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 950"
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
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
                error={errors.carpetArea?.message}
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
                error={errors.expectedPossessionYear?.message}
                placeholder="e.g. 2026"
            />
            <TextInput
                label="Price from"
                name="priceFrom"
                register={register}
                required
                error={errors.priceFrom?.message}
                placeholder="e.g. 5000000"
            />
            <TextInput
                label="Price to"
                name="priceTo"
                register={register}
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
                options={["1 to 3", "3 to 5", "5 to 10", "10 Plus"]}
                error={errors.noOfTowers?.message}
            />
            <ChoiceChips
                label="No. of Floors"
                name="noOfFloors"
                control={control}
                options={["1 to 5", "6 to 10", "11 to 20", "20+"]}
                error={errors.noOfFloors?.message}
            />
            <TextInput
                label="Total Units"
                name="totalUnits"
                register={register}
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
                label="Furnishing"
                name="furnishing"
                control={control}
                options={["Furnished", "Semi-Furnished", "Unfurnished"]}
                error={errors.furnishing?.message}
            />
            <ChoiceChips
                label="Listed by"
                name="listedBy"
                control={control}
                options={["Builder", "Dealer", "Owner"]}
                error={errors.listedBy?.message}
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
                register={register}
                required
                error={errors.superBuiltupArea?.message}
                placeholder="e.g. 800"
            />
            <TextInput
                label="Carpet Area (sqft)"
                name="carpetArea"
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 650"
            />
            <TextInput
                label="Maintenance (Monthly)"
                name="maintenance"
                register={register}
                error={errors.maintenance?.message}
                placeholder="e.g. 3000"
            />
            <ChoiceChips
                label="Car Parking"
                name="carParking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.carParking?.message}
            />
            <TextInput
                label="Washrooms"
                name="washrooms"
                register={register}
                error={errors.washrooms?.message}
                placeholder="e.g. 2"
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
                label="Furnishing"
                name="furnishing"
                control={control}
                options={["Furnished", "Semi-Furnished", "Unfurnished"]}
                error={errors.furnishing?.message}
            />
            <ChoiceChips
                label="Project Status"
                name="projectStatus"
                control={control}
                options={["New Launch", "Ready to Move", "Under Construction"]}
                error={errors.projectStatus?.message}
            />
            <ChoiceChips
                label="Listed by"
                name="listedBy"
                control={control}
                options={["Builder", "Dealer", "Owner"]}
                error={errors.listedBy?.message}
            />
            <TextInput
                label="Super Builtup area (sqft)"
                name="superBuiltupArea"
                register={register}
                required
                error={errors.superBuiltupArea?.message}
                placeholder="e.g. 800"
            />
            <TextInput
                label="Carpet Area (sqft)"
                name="carpetArea"
                register={register}
                required
                error={errors.carpetArea?.message}
                placeholder="e.g. 650"
            />
            <TextInput
                label="Maintenance (Monthly)"
                name="maintenance"
                register={register}
                error={errors.maintenance?.message}
                placeholder="e.g. 3000"
            />
            <ChoiceChips
                label="Car Parking"
                name="carParking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.carParking?.message}
            />
            <TextInput
                label="Washrooms"
                name="washrooms"
                register={register}
                error={errors.washrooms?.message}
                placeholder="e.g. 2"
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

export function PGGuestHousesForm({ control, errors }: SubFormProps) {
    return (
        <SubFormGrid>
            <ChoiceChips
                label="Subtype"
                name="subtype"
                control={control}
                options={["Guest Houses", "PG", "Roommate"]}
                error={errors.subtype?.message}
            />
            <ChoiceChips
                label="Furnishing"
                name="furnishing"
                control={control}
                options={["Furnished", "Semi-Furnished", "Unfurnished"]}
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
                name="carParking"
                control={control}
                options={["0", "1", "2", "3+"]}
                error={errors.carParking?.message}
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

export const FishesAquariumForm = EmptySubForm;
export const PetFoodAccessoriesForm = EmptySubForm;
export const DogsForm = EmptySubForm;
export const OtherPetsForm = EmptySubForm;

// ─── Services ────────────────────────────────────────────────────────────────

export const EducationClassesForm = EmptySubForm;
export const ToursTravelForm = EmptySubForm;
export const ElectronicsRepairServicesForm = EmptySubForm;
export const HealthBeautyForm = EmptySubForm;
export const HomeRenovationRepairForm = EmptySubForm;
export const CleaningPestControlForm = EmptySubForm;
export const LegalDocumentationServicesForm = EmptySubForm;
export const PackersMoversForm = EmptySubForm;
export const OtherServicesForm = EmptySubForm;
