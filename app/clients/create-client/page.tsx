"use client"
import { ChangeEvent, ReactNode, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { setClientField, resetClient } from "@/lib/redux/Features/clientSlice"
import { Globe, Mail, MapPin, Phone, User, Loader2 } from "lucide-react"
import Swal from "sweetalert2";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { clients_route } from "@/lib/helpers/api-endpoints"

export default function NewClientForm() {
  const dispatch = useDispatch()
  const client = useSelector((state: RootState) => state.client)
  const [loading, setLoading] = useState(false)
  const [country, setCountry] = useState(client.country)

  const handleChange = (field: string, value: string | number) => {
    dispatch(setClientField({ field: field as keyof typeof client, value }))
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(clients_route, client);

      dispatch(resetClient());
      Swal.fire({
        title: "Client Created Successfully!",
        icon: "success",
      });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        // Define the expected error response shape
        type ErrorResponse = {
          issues?: Record<string, string>;
          message?: string;
        };

        const data = err.response?.data as ErrorResponse;

        if (data?.issues) {
          const errors = Object.entries(data.issues)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join("\n");

          Swal.fire({
            title: "Validation Errors",
            text: errors,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: data?.message || "An error occurred while creating the client.",
            icon: "error",
          });
        }
      } else {
        // Handle non-Axios errors
        console.error('Unexpected error:', err);
        Swal.fire({
          title: "Error",
          text: "An unexpected error occurred",
          icon: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 p-2 sm:p-4">
      <Card className="md:w-full p-6 bg-white rounded-lg shadow-md relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
            Welcome to the New Client Page
          </h2>
          <Link href="/clients">
            <button className="text-gray-500 hover:text-black text-xl cursor-pointer">✕</button>
          </Link>
        </div>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MyCustomFormField
            id="client-name"
            label="Client Name"
            icon={<User size={16} />}
            value={client.clientName}
            onChange={(e: { target: { value: string | number } }) => handleChange("clientName", e.target.value)}
          />

          <MyCustomFormField
            id="company-name"
            label="Company Name"
            icon={<User size={16} />}
            value={client.companyName}
            onChange={(e: { target: { value: string | number } }) => handleChange("companyName", e.target.value)}
          />

          <MyCustomFormField
            id="email"
            label="Email Address"
            icon={<Mail size={16} />}
            value={client.email}
            onChange={(e: { target: { value: string | number } }) => handleChange("email", e.target.value)}
          />

          <MyCustomFormField
            id="mobile"
            label="Mobile Number"
            icon={<Phone size={16} />}
            value={client.mobile}
            onChange={(e: { target: { value: string | number } }) => handleChange("mobile", e.target.value)}
          />

          <MyCustomFormField
            id="address"
            label="Address"
            icon={<MapPin size={16} />}
            value={client.address}
            onChange={(e: { target: { value: string | number } }) => handleChange("address", e.target.value)}
          />

          <MyCustomFormField
            id="postal"
            label="Postal Code"
            value={client.postal}
            onChange={(e: { target: { value: string | number } }) => handleChange("postal", e.target.value)}
          />

          <MyCustomFormField
            id="state"
            label="State/Province"
            value={client.state}
            onChange={(e: { target: { value: string | number } }) => handleChange("state", e.target.value)}
          />

          <div>
            <Label htmlFor="country" className="mb-2 text-gray-500">Country</Label>
            <select
              id="country"
              value={country}
              onChange={(e) => {
                setCountry(e.target.value)
                handleChange("country", e.target.value)
              }}
              className="border rounded-md p-4 w-full text-gray-500"
            >
              <option value="India">🇮🇳 India</option>
              <option value="USA">🇺🇸 USA</option>
              <option value="UK">🇬🇧 UK</option>
            </select>
          </div>

          <MyCustomFormField
            id="service-charge"
            label="Service Charge"
            type="number"
            value={client.serviceCharge}
            onChange={(e: { target: { value: string } }) =>
              handleChange("serviceCharge", Number(e.target.value))
            }
          />

          <MyCustomFormField
            id="website"
            label="Website"
            icon={<Globe size={16} />}
            value={client.website}
            onChange={(e: { target: { value: string | number } }) => handleChange("website", e.target.value)}
          />
        </CardContent>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4">
          <Button
            variant="outline"
            className="w-full text-[#532B88] p-4 sm:w-auto text-lg border-[#532B88]"
            onClick={() => dispatch(resetClient())}
          >
            Cancel
          </Button>

          <Button
            className="bg-[#532B88] text-white p-4 w-full sm:w-auto text-lg flex items-center justify-center gap-2"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}


export interface MyCustomFormFieldPropTypes {
  id: string,
  label: string,
  icon?: ReactNode,
  value: string | number,
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Helper Components:
function MyCustomFormField({ id, label, icon, value, onChange, type = "text" }: MyCustomFormFieldPropTypes) {
  return (
    <div>
      <Label htmlFor={id} className="text-gray-500">{label}</Label>
      <div className="flex items-center gap-2 border rounded-md p-2 mt-2 focus:outline-none text-gray-700">
        {icon}
        <Input
          id={id}
          type={type}
          placeholder={`Enter ${label.toLowerCase()}`}
          className="border-none w-full outline-none py-1 focus:outline-none text-gray-800"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
