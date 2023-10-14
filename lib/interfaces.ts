type employee = {
  id: string;
  name: string;
  email: string;
  company: string;
  permission: string;
  cedula: number;
};

type event = {
  id: string;
  name: string;
  created_at: Date;
  /// print button
  print?: React.ReactNode;
  has_printed_qr?: boolean | string;
};
