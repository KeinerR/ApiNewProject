using System;
using System.Security.Cryptography;
using System.Text;

public class PasswordHasherService
{
    public byte[] GenerateSalt(int size = 32)
    {
        byte[] salt = new byte[size];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }
        return salt;
    }

    public string HashPassword(string password, byte[] salt)
    {
        using (var sha256 = SHA256.Create())
        {
            var saltedPassword = new byte[salt.Length + Encoding.UTF8.GetBytes(password).Length];
            Buffer.BlockCopy(salt, 0, saltedPassword, 0, salt.Length);
            Buffer.BlockCopy(Encoding.UTF8.GetBytes(password), 0, saltedPassword, salt.Length, Encoding.UTF8.GetBytes(password).Length);

            var hash = sha256.ComputeHash(saltedPassword);
            var hashBytes = new byte[hash.Length + salt.Length];
            Buffer.BlockCopy(salt, 0, hashBytes, 0, salt.Length);
            Buffer.BlockCopy(hash, 0, hashBytes, salt.Length, hash.Length);

            return Convert.ToBase64String(hashBytes);
        }
    }

    public bool VerifyPassword(string enteredPassword, string storedHash)
    {
        var hashBytes = Convert.FromBase64String(storedHash);
        var salt = new byte[32];
        Buffer.BlockCopy(hashBytes, 0, salt, 0, salt.Length);
        var enteredHash = HashPassword(enteredPassword, salt);
        return enteredHash == storedHash;
    }
}
