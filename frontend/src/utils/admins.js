export const adminUserIds = ["774d719c-59a8-48be-a2f4-5dc67124d9d9"];

/*CREATE POLICY "Allow admins to insert products"
ON public.products
FOR INSERT
USING (
  auth.uid() = any(ARRAY['YOUR_ADMIN_USER_ID_1', 'YOUR_ADMIN_USER_ID_2'])
); */
//SQL'de admine yetki eklemek için bunu kullan
