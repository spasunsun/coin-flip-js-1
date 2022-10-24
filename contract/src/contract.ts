import { NearBindgen, NearPromise, call } from 'near-sdk-js'
import { AccountId } from 'near-sdk-js/lib/types';
@NearBindgen({})
class Contract{
  @call({})
  transfer({ to, amount }: { to: AccountId, amount: bigint }) {
    NearPromise.new(to).transfer(amount);
  }
}