import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { sendOtp, signIn, signUp } from "../api/auth";
import BaseButton from "../base/baseButton";
import BaseInput from "../base/baseInput";
import { ROUTES } from "../constants/route.constant";

type AuthFormProps = {
  mode: "login" | "register";
  onStepChange?: (isVerifyCode: boolean) => void;
};

export default function AuthForm({ mode, onStepChange }: AuthFormProps) {
  const [isVerifyCode, setIsVerifyCodeState] = useState(false);
  const [loading, setLoading] = useState(false);

  const setIsVerifyCode = (val: boolean) => {
    setIsVerifyCodeState(val);
    onStepChange?.(val);
  };
  
  const { control, getValues, handleSubmit, resetField, setValue } = useForm<{ email: string; otp: string }>({
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const onSendOtp = async ({ email }: { email: string; otp: string }) => {
    setLoading(true);

    const result = await sendOtp({ email });
    
    setLoading(false);

    if (!(result instanceof Error)) {
      setIsVerifyCode(true);
    }
  };

  const onVerify = async ({ email, otp }: { email: string; otp: string }) => {
    setLoading(true);

    const payload = {
      email,
      verifyCode: Number(otp),
    };

    if (mode === "login") {
      await signIn(payload);
    } else {
      await signUp(payload);
    }

    setLoading(false);
  };

  const backToEmailStep = () => {
    resetField("otp");
    setIsVerifyCode(false);
  };

  return (
    <div className="flex flex-col gap-2">
      {isVerifyCode && (
        <div className="text-center mb-2">
          <h2 className="text-[28px] font-bold text-gray-900 leading-9 mb-2">Email Verification</h2>
          <p className="text-[11px] text-[#536488] leading-relaxed">
            Please enter your code that send to your email address
          </p>
        </div>
      )}

      {!isVerifyCode && (
        <div className="text-center text-sm font-medium text-gray-600 leading-4.5">
          {mode === "login" && "Log in to continue"}
          {mode === "register" && "Sign up to continue"}
        </div>
      )}

      {!isVerifyCode && (
        <form onSubmit={handleSubmit(onSendOtp)} className="space-y-1">
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <BaseInput
                type="email"
                placeholder="Enter your email"
                value={field.value}
                onChange={field.onChange}
                onClear={() => setValue("email", "")}
                align="center"
                disabled={loading}
              />
            )}
          />

          <BaseButton type="submit" className="w-full" loading={loading}>
            Continue
          </BaseButton>
        </form>
      )}

      {isVerifyCode && (
        <form onSubmit={handleSubmit(onVerify)} className="space-y-1">
          <Controller
            name="otp"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <BaseInput
                type="text"
                placeholder="Enter code verification"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ""))}
                onClear={() => setValue("otp", "")}
                align="center"
                disabled={loading}
              />
            )}
          />

          <BaseButton type="submit" className="w-full" loading={loading}>
            Submit
          </BaseButton>

          <div className="flex items-center justify-between text-xs text-blue-600 px-1 pt-1">
            <button type="button" onClick={backToEmailStep} className="hover:underline" disabled={loading}>
              Back
            </button>

            <button
              type="button"
              onClick={() => onSendOtp({ email: getValues("email"), otp: getValues("otp") })}
              className="hover:underline"
              disabled={loading}
            >
              Resend code
            </button>
          </div>
        </form>
      )}

      {!isVerifyCode && (
        <div className="text-center text-xs mt-1">
          {mode === "login" && (
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to={ROUTES.REGISTER} className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          )}

          {mode === "register" && (
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
