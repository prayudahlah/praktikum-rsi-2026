// Tanpa DI: komponen membuat sendiri kebutuhannya.
// AuthService terikat keras ke UserRepository, sulit diganti saat testing.
class AuthServiceTerikat {
  private users = new UserRepository();
}

// Dengan DI: kebutuhan diterima dari luar lewat constructor.
export class AuthService {
  constructor(
    private users: UserRepository = new UserRepository(),
  ) {}

  async login(email: string) {
    return this.users.findByEmail(email);
  }
}

// Pemakaian normal cukup pakai default, tidak perlu mengisi apa pun:
new AuthService();

// Saat testing, suntik tiruan tanpa mengubah isi AuthService:
new AuthService(new FakeUserRepository());
