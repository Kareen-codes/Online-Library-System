from slowapi import Limiter
from slowapi.util import get_remote_address

print("LOADING LIMITER FILE...")
limiter = Limiter(key_func=get_remote_address)

print("Limiter:", limiter)