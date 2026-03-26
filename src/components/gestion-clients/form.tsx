'use client'

import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { CustomerFormData } from "../../interface/Customer";
import { CirclePlus, SquarePen, X } from "lucide-react";

interface CustomerFormProps {
  loading: boolean;
  error: string | null;
  editingCustomer: number | null;
  form: CustomerFormData;
  isOpen: boolean;
  closeModal: () => void;
  setForm: React.Dispatch<React.SetStateAction<CustomerFormData>>;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  errorStatus?: boolean;
}

export default function CustomerForm({
  form,
  isOpen,
  closeModal,
  setForm,
  resetForm,
  handleSubmit,
  editingCustomer,
  loading,
  error,
  errorStatus,
}: CustomerFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">
        <h4 className="text-2xl font-semibold mb-4">
          {editingCustomer ? "Modifier le client" : "Nouveau client"}
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorStatus && (
            <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <Label>Nom complet</Label>
            <Input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              // required
            />
          </div>

          <div>
            <Label>Téléphone</Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              // required
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                closeModal();
              }}
            ><X className="w-4 h-4 mr-1"/>
              Annuler
            </Button>

            <Button type="submit" loading={loading}>{loading ?"": editingCustomer ? <SquarePen className="w-4 h-4 mr-1"/> : <CirclePlus className="w-4 h-4 mr-1"/> }
              {editingCustomer ? "Mettre à jour" : "Ajouter"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}