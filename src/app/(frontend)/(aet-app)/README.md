# AET App

## TODO

- [x] CRM Loading issue:
      Eventually, I pinpointed the cause: when I enter the admin username and password, Chrome detects that the password is weak and often warns me about a potential security breach. This warning is what caused the page to freeze. Once I went into Chrome settings and dismissed the password warning for this site, the issue disappeared! 🚀
- [x] feat: we can change the payment price for every order (bufore payment) in admin panel
- [x] Dropbox refresh token
- [x] Customized Service
- [x] Email sending
- [x] clean up payment code!!!
- [x] Upload file for each user
- [x] Update/e-terms-of-use.html ! User should agree before submit. And it to /apply and /e_pay.html
- [x] Add 'payment_amount' in supabase
- [x] Add 'office' in supabase
- [x] Add CHECK for database update or insert!!! (like, only if it is submitted, we can change the office or payment_amount ) Backend
- [ ] Update fuzzy filter
- [ ] Add CHECK for database update or insert!!! (like, only if it is submitted, we can change the office or payment_amount ) Database
- [ ] better email template, table layout
- [ ] should we delete 'additionalServices' and just keep 'additionalServicesQuantity'??
- [ ] 上传文件路径调整（支付前后，文件夹变化）
- [x] 服务价格公寓复杂、过时。可能要删掉所有参考价格。
- [x] 增加一个字段（'purpose'？）记录对应服务。

  - [x] miami： 翻译公证，学历评估，口译，签证

- [x] status 界面增加 instruction
- [x] status 增加hover card，说明所需上传文件
- [ ] 1.单独建立五个申请卡片，对应 general，translation，evaluation和 visa
- [x] 2.其中 evaluation 要分： immigration，employment，education
- [x] 3.CE 的 application 要明确 交付时间和申请服务(参考截图，可以不写价格)邮寄费用、pdf 费用都要标注
- [ ] 4.translation 在提交之前上传文件
- [x] 5.在确认邮件里增加一个支付按钮。
- [x] 加急付款只能用 zelle，提到 stripe 有手续费
- [x] 默认要pdf。
- [x] email 里提醒大家 reply all。
- [x] status 页面，把支付按钮放到最上面。
- [x] 6.单独显示 first name， last name， middle name
- [x] sf 邮箱要确认一下！！！
- [x] Old ApplicationForm is kinda **deprecated**
- [x] Add a button to dropbox folder for each order.
- [x] Add a Loading button for payment
- [x] use components for Reviews
- [x] Better layout for Status page
- [x] any way for Status page to pre load???
- [x] user add comments for their services
- [x] show files uploaded.
- [x] 付款倒计时！
- [x] delete "valid_purpose_other":
      ((((purpose = 'other'::text) AND (purpose_other IS NOT NULL)) OR ((purpose <> 'other'::text) AND (purpose_other IS NULL))))
      to avoid:
      new row for relation "fce_applications" violates check constraint "valid_purpose_other"
- [x] 有两个邮寄选项选不上啊 ！！！已修复
- [x] 取消 3% 手续费的提示
- [x] 把 payment 放到上传文件下面
- [x] 状态页增加 Timeline/步骤状态图（比如：✅ Application Submitted → ⏳ Documents Pending → 🚀 Payment Confirmed → 📄 Evaluation Processing）
- [x] 调整邮件格式，增加更明显的用户引导
- [x] 在用户上传文件后，后台可以 check 他的文件是否正确，
- [ ] 上传文件后，发送邮件确认 （zhao）
- [x] Stripe 完成付款后，发送邮件进行确认。（tong）
- [x] CRM 处理进度 可视化。
- [ ] 要有邮件发送的倒计时（zhao）
- [ ] 某些情况下，手动设置价格后，发送邮件提示用户付款
- [x] 增加付款的倒计时（暂时设置成半小时）
- [x] 要增加 sample，在表格第一页！
- [x] Marked as Paid for Zelle/ Paypal (stripe has payment id)
- [ ] 需要能手动导入 （批量？） 数据 （tong）
- [ ] 参考 SuccessMessage，需要建立 FailedMsg
- [x] Stripe 的 bank transfer 太慢了。 1-3 天。我们取消了。
- [x] 不能把 paid 重写为 expired
- [ ] fix `export interface Application extends Omit<DatabaseApplication,'service_type'|'educations'>`
- [ ] 48小时自动标记 expired
- [ ] 设置 due amount 后发邮件通知
- [ ] 付款后，自动更新due amount
- [ ] 为每笔支付单独新建一个表（zelle Stripe paypal）
- [ ] evaluee name 加上 proun

## Features

- Multi-step form wizard with progress indicator
- Form state management with Zustand and persistence
- Form validation with Zod and React Hook Form
- Draft saving functionality
- Real-time price calculation
- Reset functionality with confirmation
- Responsive design
- Accessibility support

## Component Structure

```
FCE-Form/
├── index.tsx           # Main form component
├── StepIndicator.tsx   # Progress indicator component
├── constants.ts        # Form constants and pricing
├── schema.ts          # Zod validation schema
├── store.ts           # Zustand state management
├── types.ts           # TypeScript definitions
├── utils.ts           # Helper functions
└── steps/            # Form step components
    ├── ClientInfo.tsx        # Client information step
    ├── EvalueeInfo.tsx       # Evaluee information step
    ├── ServiceSelection.tsx  # Service selection step
    └── Review.tsx            # Review and submit step
```

## Form Steps

1. **Client Information** (`ClientInfo.tsx`)

   - Company/Individual name
   - Contact information
   - Address details (with country-specific regions)
   - Purpose of evaluation

2. **Evaluee Information** (`EvalueeInfo.tsx`)

   - Personal information
   - Multiple education records
   - Study period details
   - Dynamic education fields

3. **Service Selection** (`ServiceSelection.tsx`)

   - Document Evaluation Services
     - Foreign Credential Evaluation
     - Course-by-course Evaluation
     - Professional Experience Evaluation
     - Position Evaluation
   - Translation Service
   - Delivery options
   - Additional services with quantities

4. **Review** (`Review.tsx`)

   - Summary of all information
   - Price calculation
   - Final submission

## State Management

Using Zustand for form state management with persistence:

```typescript
interface FormState {
  formData: Partial<FormData>
  currentStep: FormStep
  draftId: string | null
  status: 'draft' | 'completed' | null
  isLoading: boolean
  isSaving: boolean

  // Actions
  setFormData: (data: Partial<FormData>) => void
  setCurrentStep: (step: FormStep) => void
  saveDraft: () => Promise<void>
  submitForm: () => Promise<void>
  loadDraft: (draftId: string) => Promise<void>
  resetForm: () => void
}
```

## Usage

```tsx
import FCEForm from '@/app/components/FCE-Form'

export default function FormPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <FCEForm />
      </div>
    </div>
  )
}
```

## Supabase Configuration

```sql



-- 主表：FCE申请表
create table fce_applications (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'draft' check (
    status in ('draft', 'submitted', 'processing', 'completed', 'cancelled')
  ),
  current_step smallint not null default 0,

  -- Client Information
  name text not null,
  country text not null,
  street_address text not null,
  street_address2 text,
  city text not null,
  region text not null,
  zip_code text not null check (zip_code ~ '^\d{5}(-\d{4})?$'),
  fax text check (fax ~ '^\d{3}-\d{3}-\d{4}$'),
  phone text not null check (phone ~ '^\d{3}-\d{3}-\d{4}$'),
  email text not null check (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  purpose text not null check (
    purpose in ('immigration', 'employment', 'education', 'other')
  ),
  purpose_other text,

  -- Evaluee Information
  pronouns text not null check (
    pronouns in ('mr', 'ms', 'mx')
  ),
  first_name text not null,
  last_name text not null,
  middle_name text,
  date_of_birth date not null,

  -- Service Selection
  service_type jsonb not null,
  delivery_method text not null check (
    delivery_method in (
      'no_delivery_needed',
      'usps_first_class_domestic',
      'usps_first_class_international',
      'usps_priority_domestic',
      'usps_express_domestic',
      'ups_express_domestic',
      'usps_express_international',
      'fedex_express_international'
    )
  ),
  additional_services text[] default '{}',
  additional_services_quantity jsonb default '{
    "extra_copy": 0,
    "pdf_with_hard_copy": 0,
    "pdf_only": 0
  }'::jsonb,

  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  submitted_at timestamptz,

  -- Validation
  constraint valid_purpose_other check (
    (purpose = 'other' and purpose_other is not null) or
    (purpose != 'other' and purpose_other is null)
  )
);

-- 教育经历表（简化版，移除了时间戳）
create table fce_educations (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references fce_applications(id) on delete cascade,

  country_of_study text not null,
  degree_obtained text not null,
  school_name text not null,
  study_start_date jsonb not null, -- 存储 { month: string, year: string }
  study_end_date jsonb not null    -- 存储 { month: string, year: string }
);

-- 创建索引
create index idx_fce_applications_status on fce_applications(status);
create index idx_fce_applications_email on fce_applications(email);
create index idx_fce_educations_application on fce_educations(application_id);

-- 创建更新时间触发器
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_fce_applications_updated_at
  before update on fce_applications
  for each row
  execute function update_updated_at();


-- 启用 RLS
alter table fce_applications enable row level security;
alter table fce_educations enable row level security;

-- 允许创建新申请
create policy "Anyone can create applications"
  on fce_applications for insert
  to public
  with check (true);

-- 允许通过 ID 查看申请
create policy "Anyone can view applications with ID"
  on fce_applications for select
  using (true);

-- 只允许修改草稿状态的申请
create policy "Anyone can update draft applications"
  on fce_applications for update
  using (status = 'draft');

-- 教育经历表的访问策略
create policy "Anyone can manage educations"
  on fce_educations for all
  using (true);
```

## Key Features Implementation

### Progress Indicator

- Visual step tracking
- Interactive step navigation
- Validation before step advancement

### Form Validation

- Real-time field validation
- Step-specific validation rules
- Custom validation messages

### Price Calculation

- Real-time price updates
- Multiple service combinations
- Quantity-based calculations

### Data Persistence

- Local storage backup
- Draft saving functionality
- Form reset capability

## TODO

- [ ] Implement form submission API integration
- [ ] Add loading states for async operations
- [ ] Enhance error handling and display
- [ ] Add comprehensive unit tests
- [ ] Implement form data persistence with backend
- [ ] Add form draft auto-saving
- [ ] Implement comprehensive price calculation validation
- [ ] Add print/export functionality for completed forms
- [ ] Implement form data encryption
- [ ] Add form completion progress tracking

## Contributing

When contributing to this component:

1. Ensure all comments are in English
2. Follow the existing code style and patterns
3. Update tests when modifying functionality
4. Update documentation for any changes
5. Test all form steps thoroughly
6. Ensure accessibility standards are maintained

## Dependencies

- React Hook Form
- Zod
- Zustand
- Tailwind CSS
- Shadcn UI Components
- Day.js
- Country-State-City
