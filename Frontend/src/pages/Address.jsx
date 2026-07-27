import React, { useState, useEffect, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { MapPin, Plus, Trash2, CheckCircle, Home, Briefcase, Building } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { toast } from "react-toastify";

const Addresses = () => {
  const { userData, updateUserProfile, token } = useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    if (userData && userData.address) {
      setAddresses(userData.address);
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.pincode) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newAddress = {
      id: Date.now().toString(),
      ...formData,
    };

    let updatedList = [...addresses];
    if (formData.isDefault || addresses.length === 0) {
      updatedList = updatedList.map((addr) => ({ ...addr, isDefault: false }));
      newAddress.isDefault = true;
    }

    updatedList.push(newAddress);

    const success = await updateUserProfile({ address: updatedList });
    if (success) {
      setAddresses(updatedList);
      setShowAddForm(false);
      setFormData({
        title: "Home",
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        isDefault: false,
      });
    }
  };

  const handleDelete = async (id) => {
    const updatedList = addresses.filter((addr) => addr.id !== id);
    const success = await updateUserProfile({ address: updatedList });
    if (success) {
      setAddresses(updatedList);
      toast.success("Address removed successfully");
    }
  };

  const handleSetDefault = async (id) => {
    const updatedList = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    const success = await updateUserProfile({ address: updatedList });
    if (success) {
      setAddresses(updatedList);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]/50">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]">Saved Addresses</h2>
          <p className="text-xs text-[var(--text-muted)]">Manage your delivery locations and shipping addresses</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-full gap-2 text-xs font-semibold bg-[var(--primary-accent)] text-white hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Cancel" : "Add Address"}
        </Button>
      </div>

      {/* Add Address Form Modal/Section */}
      {showAddForm && (
        <Card className="border border-[var(--primary-accent)]/30 bg-[var(--bg-subtle)]/50 shadow-md">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[var(--text-main)] mb-4">Add New Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="flex gap-3 mb-2">
                {["Home", "Work", "Other"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFormData({ ...formData, title: tag })}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      formData.title === tag
                        ? "bg-[var(--primary-accent)] text-white shadow-sm"
                        : "bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--secondary-accent)]/10"
                    }`}
                  >
                    {tag === "Home" && <Home className="w-3.5 h-3.5" />}
                    {tag === "Work" && <Briefcase className="w-3.5 h-3.5" />}
                    {tag === "Other" && <Building className="w-3.5 h-3.5" />}
                    {tag}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  name="fullName"
                  placeholder="Full Name *"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="phone"
                  placeholder="Mobile Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                name="street"
                placeholder="Street Address, House/Flat No., Area *"
                value={formData.street}
                onChange={handleChange}
                required
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input
                  name="city"
                  placeholder="City *"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="state"
                  placeholder="State/Region"
                  value={formData.state}
                  onChange={handleChange}
                />
                <Input
                  name="pincode"
                  placeholder="Postal Code *"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded border-[var(--border-color)] text-[var(--primary-accent)] accent-[var(--primary-accent)] w-4 h-4"
                />
                <label htmlFor="isDefault" className="text-xs text-[var(--text-main)] font-medium cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-[var(--primary-accent)] text-white">
                  Save Address
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <Card className="border-[var(--border-color)] text-center py-12">
          <CardContent className="space-y-3">
            <MapPin className="w-12 h-12 text-[var(--text-muted)] mx-auto opacity-50" />
            <p className="text-base font-semibold text-[var(--text-main)]">No addresses saved yet</p>
            <p className="text-xs text-[var(--text-muted)]">Add a delivery address to speed up your checkout process.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card
              key={addr.id || addr._id}
              className={`relative border transition-all ${
                addr.isDefault
                  ? "border-[var(--primary-accent)] bg-[var(--primary-accent)]/5 shadow-sm"
                  : "border-[var(--border-color)] hover:border-[var(--secondary-accent)]"
              }`}
            >
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--text-main)] flex items-center gap-1.5">
                      {addr.title === "Work" ? (
                        <Briefcase className="w-4 h-4 text-[var(--primary-accent)]" />
                      ) : (
                        <Home className="w-4 h-4 text-[var(--primary-accent)]" />
                      )}
                      {addr.title || "Home"}
                    </span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                        Default
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-rose-500 hover:text-rose-700 p-1 transition cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-[var(--text-main)] space-y-1">
                  <p className="font-bold text-sm">{addr.fullName}</p>
                  <p className="text-[var(--text-muted)]">{addr.street}</p>
                  <p className="text-[var(--text-muted)]">
                    {addr.city}{addr.state ? `, ${addr.state}` : ""} - {addr.pincode}
                  </p>
                  <p className="text-[var(--text-muted)]">{addr.country}</p>
                  <p className="font-medium pt-1 text-[var(--text-main)]">Phone: {addr.phone}</p>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-semibold text-[var(--primary-accent)] hover:underline flex items-center gap-1 pt-2 border-t border-[var(--border-color)]/40 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Set as Default Address
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
