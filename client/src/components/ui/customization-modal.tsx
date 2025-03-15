import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface CustomizationModalProps {
    item: MenuItem;
    open: boolean;
    onClose: () => void;
    onAddToOrder: (item: MenuItem, customizations: any) => void;
}

interface Customizations {
    removedIngredients: string[];
    specialInstructions: string;
    quantity: number;
    cookingPreference: string;
}

export function CustomizationModal({
    item,
    open,
    onClose,
    onAddToOrder
}: CustomizationModalProps) {
    const [customizations, setCustomizations] = useState < Customizations > ({
        removedIngredients: [],
        specialInstructions: "",
        quantity: 1,
        cookingPreference: ""
    });

    // Determine ingredients based on item category
    const getIngredients = () => {
        const commonIngredients = ["Salt", "Pepper"];

        if (item.category === "Main Course") {
            return [...commonIngredients, "Onions", "Garlic", "Butter", "Sauce"];
        } else if (item.category === "Starters") {
            return [...commonIngredients, "Herbs", "Garlic"];
        } else if (item.category === "Desserts") {
            return ["Sugar", "Vanilla", "Whipped Cream"];
        } else {
            return commonIngredients;
        }
    };

    // Determine cooking preferences based on item name/category
    const getCookingPreferences = () => {
        const itemName = item.name.toLowerCase();

        if (itemName.includes("steak")) {
            return ["Rare", "Medium Rare", "Medium", "Medium Well", "Well Done"];
        } else if (itemName.includes("burger")) {
            return ["Medium Rare", "Medium", "Well Done"];
        } else if (itemName.includes("fish") || itemName.includes("salmon")) {
            return ["Lightly Cooked", "Medium", "Well Done"];
        } else if (item.category === "Drinks") {
            return ["No Ice", "Light Ice", "Extra Ice"];
        } else {
            return ["Regular", "Light", "Extra"];
        }
    };

    const toggleIngredient = (ingredient: string) => {
        setCustomizations(prev => ({
            ...prev,
            removedIngredients: prev.removedIngredients.includes(ingredient)
                ? prev.removedIngredients.filter(i => i !== ingredient)
                : [...prev.removedIngredients, ingredient]
        }));
    };

    const handleAddToOrder = () => {
        onAddToOrder(item, customizations);
        onClose();
        // Reset for next time
        setCustomizations({
            removedIngredients: [],
            specialInstructions: "",
            quantity: 1,
            cookingPreference: ""
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Customize {item.name}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Quantity selector */}
                    <div className="flex items-center justify-between">
                        <Label>Quantity</Label>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCustomizations(prev => ({
                                    ...prev,
                                    quantity: Math.max(1, prev.quantity - 1)
                                }))}
                                disabled={customizations.quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{customizations.quantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setCustomizations(prev => ({
                                    ...prev,
                                    quantity: prev.quantity + 1
                                }))}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Cooking preferences */}
                    <div className="space-y-2">
                        <Label>Cooking Preference</Label>
                        <Select
                            onValueChange={(value) => setCustomizations(prev => ({
                                ...prev,
                                cookingPreference: value
                            }))}
                            value={customizations.cookingPreference}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select preference" />
                            </SelectTrigger>
                            <SelectContent>
                                {getCookingPreferences().map(pref => (
                                    <SelectItem key={pref} value={pref}>{pref}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Ingredient toggles */}
                    <div className="space-y-2">
                        <Label>Remove Ingredients</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {getIngredients().map(ingredient => (
                                <div key={ingredient} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`ingredient-${ingredient}`}
                                        checked={customizations.removedIngredients.includes(ingredient)}
                                        onCheckedChange={() => toggleIngredient(ingredient)}
                                    />
                                    <Label htmlFor={`ingredient-${ingredient}`} className="text-sm">No {ingredient}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Special instructions */}
                    <div className="space-y-2">
                        <Label>Special Instructions</Label>
                        <Textarea
                            placeholder="Add any special requests here..."
                            className="resize-none"
                            value={customizations.specialInstructions}
                            onChange={(e) => setCustomizations(prev => ({
                                ...prev,
                                specialInstructions: e.target.value
                            }))}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAddToOrder} className="flex items-center gap-1">
                        Add to Order
                        <span className="font-semibold">
                            ${(parseFloat(item.price) * customizations.quantity).toFixed(2)}
                        </span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 