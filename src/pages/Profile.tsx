import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { toast } from 'sonner';
import { Camera, Mail, Phone, Calendar } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const profileSchema = z.object({
    username: z.string().min(3, 'Username phải có ít nhất 3 ký tự'),
    firstName: z.string().min(2, 'Họ phải có ít nhất 2 ký tự'),
    lastName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ').optional().or(z.literal('')),
    dob: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user?.username || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            phone: user?.phone || '',
            dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        },
    });

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            const fullname = `${data.lastName} ${data.firstName}`.trim();
            await updateProfile({
                email: data.email,
                fullname: fullname,
            });
            toast.success('Cập nhật thông tin thành công!');
        } catch (error) {
            toast.error('Cập nhật thông tin thất bại!');
        }
    };

    const handleAvatarUpload = () => {
        setIsUploading(true);
        // Simulate upload
        setTimeout(() => {
            setIsUploading(false);
            toast.success('Đã cập nhật ảnh đại diện!');
        }, 1500);
    };

    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.username || 'User';

    const userInitial = displayName.charAt(0).toUpperCase();

    return (
        <MainLayout>
            <div className="h-full w-full overflow-y-auto">
                <div className="container mx-auto py-10 px-4 max-w-4xl">
                    <h1 className="text-3xl font-bold mb-8">Hồ sơ cá nhân</h1>
                    {/* ... rest of content ... */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: Avatar & Basic Info */}
                        <div className="md:col-span-1">
                            <Card>
                                <CardHeader className="text-center">
                                    <div className="relative mx-auto w-32 h-32 mb-4 group">
                                        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                                            {user?.avatar ? (
                                                <AvatarImage src={user.avatar} alt={displayName} />
                                            ) : null}
                                            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                                                {userInitial}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div
                                            className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity cursor-pointer ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                            onClick={handleAvatarUpload}
                                        >
                                            {isUploading ? (
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                            ) : (
                                                <Camera className="text-white h-8 w-8" />
                                            )}
                                        </div>
                                    </div>
                                    <CardTitle>{displayName}</CardTitle>
                                    <CardDescription>@{user?.username}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="h-4 w-4" />
                                            <span>{user?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            <span>{user?.phone || 'Chưa cập nhật SĐT'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {user?.dob
                                                    ? new Date(user.dob).toLocaleDateString('vi-VN')
                                                    : 'Chưa cập nhật ngày sinh'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Edit Form */}
                        <div className="md:col-span-2">
                            <Tabs defaultValue="edit" className="w-full">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="edit">Chỉnh sửa thông tin</TabsTrigger>
                                    <TabsTrigger value="password">Đổi mật khẩu</TabsTrigger>
                                </TabsList>

                                <TabsContent value="edit">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Thông tin cá nhân</CardTitle>
                                            <CardDescription>
                                                Cập nhật thông tin cá nhân của bạn tại đây.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="firstName"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Họ</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Nguyễn" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="lastName"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Tên</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Văn A" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <FormField
                                                        control={form.control}
                                                        name="username"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Username</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="nguyenvana" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="email"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Email</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="example@email.com" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="phone"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Số điện thoại</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="0912345678" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>

                                                    <FormField
                                                        control={form.control}
                                                        name="dob"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Ngày sinh</FormLabel>
                                                                <FormControl>
                                                                    <Input type="date" {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="flex justify-end">
                                                        <Button type="submit">Lưu thay đổi</Button>
                                                    </div>
                                                </form>
                                            </Form>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="password">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Đổi mật khẩu</CardTitle>
                                            <CardDescription>
                                                Thay đổi mật khẩu để bảo mật tài khoản.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                                                    <Input id="current-password" type="password" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="new-password">Mật khẩu mới</Label>
                                                    <Input id="new-password" type="password" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                                                    <Input id="confirm-password" type="password" />
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                            <Button onClick={() => toast.info('Chức năng đang phát triển')}>
                                                Đổi mật khẩu
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Profile;
