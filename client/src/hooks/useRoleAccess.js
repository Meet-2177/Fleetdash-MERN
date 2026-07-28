import { useMemo } from "react";
import useAuth from "./useAuth";
import { canAccess } from "../utils/rolePermissions";

const useRoleAccess = (module) => {
  const { user } = useAuth();
  const role = user?.role;

  return useMemo(
    () => ({
      canCreate: canAccess(role, module, "create"),
      canEdit: canAccess(role, module, "edit"),
      canDelete: canAccess(role, module, "delete"),
      canView: canAccess(role, module, "view"),
      role,
    }),
    [role, module]
  );
};

export default useRoleAccess;
