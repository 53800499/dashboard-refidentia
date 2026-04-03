import React from 'react'
import { Modal } from '../ui/modal';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Button from '../ui/button/Button';
import { TransactionFormData } from "@/interface/transaction";
import { CirclePlus, SquarePen, X } from 'lucide-react';
import { TRANSACTIONS_COMPONENT_FORM } from '@/constants/wording';

interface TransactionFormProps {
    loading: boolean;
    error: string | null;
    editingTransaction?: string | number | undefined | null;
  form: TransactionFormData;
  isOpen: boolean;
  closeModal: () => void;
  setForm: React.Dispatch<React.SetStateAction<TransactionFormData>>;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  errorStatus: boolean;
}
export default function TransactionForm({form, isOpen, closeModal, setForm, resetForm, handleSubmit, editingTransaction, loading, error, errorStatus}: TransactionFormProps) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {editingTransaction
              ? TRANSACTIONS_COMPONENT_FORM.TITLE_MODIFICATION
              : TRANSACTIONS_COMPONENT_FORM.TITLE_CREATION}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorStatus && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div>
              <Label>{TRANSACTIONS_COMPONENT_FORM.FORM.NOM.LABEL}</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <Label>{TRANSACTIONS_COMPONENT_FORM.FORM.EMAIL.LABEL}</Label>
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <Label>{TRANSACTIONS_COMPONENT_FORM.FORM.MONTANT.LABEL}</Label>
              <Input
                type="number"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) || 0 })
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
                className='hover:text-red-800 hover:bg-red-100'
              ><X className="w-4 h-4 mr-1"/>
                {TRANSACTIONS_COMPONENT_FORM.BUTTON.CANCEL}
              </Button>
              <Button type="submit" loading={loading}>{loading ?"": editingTransaction ? <SquarePen className="w-4 h-4 mr-1"/> : <CirclePlus className="w-4 h-4 mr-1"/> }
                {editingTransaction ? TRANSACTIONS_COMPONENT_FORM.BUTTON.UPDATE : TRANSACTIONS_COMPONENT_FORM.BUTTON.ADD}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}
