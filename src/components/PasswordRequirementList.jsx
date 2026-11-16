import React from 'react';
import { Check, X } from 'lucide-react';
import { PASSWORD_RULES, validatePassword } from '../utils/passwordValidation';

export default function PasswordRequirementList({ password = '' }) {
  const { checks, strength } = validatePassword(password);

  const getStrengthBadge = () => {
    if (!password) return null;
    if (strength === 'Strong') {
      return <span className="text-xs px-2 py-0.5 rounded font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">Strong</span>;
    }
    if (strength === 'Moderate') {
      return <span className="text-xs px-2 py-0.5 rounded font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">Moderate</span>;
    }
    return <span className="text-xs px-2 py-0.5 rounded font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300">Needs attention</span>;
  };

  return (
    <div className="mt-2 p-3 rounded-xl bg-slate-100/90 dark:bg-[#111d35] border border-slate-200 dark:border-[#223558] text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-slate-700 dark:text-slate-200">Security Requirements:</span>
        {getStrengthBadge()}
      </div>
      <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
        {PASSWORD_RULES.map(rule => {
          const passed = checks[rule.id];
          return (
            <li key={rule.id} className="flex items-center gap-2">
              {passed ? (
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              ) : (
                <span className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                  <X className="w-2.5 h-2.5 stroke-[2.5]" />
                </span>
              )}
              <span className={passed ? 'text-emerald-700 dark:text-emerald-300 font-medium' : 'text-slate-500 dark:text-slate-400'}>
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
