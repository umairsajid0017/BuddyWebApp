"use client"

import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, SearchIcon, PlusIcon, XIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import Main from "@/components/ui/main"
import { useAuth } from "@/store/authStore"
import Loading from "@/components/ui/loading"
import { CURRENCY } from "@/utils/constants"
import { 
  useWalletCredit, 
  useInitPaymentGateway, 
  useCustomerTransactions,
  AddToWalletData,
  Transaction
} from "@/lib/api/wallet"

const WalletPage = () => {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [comment, setComment] = useState("Added to wallet")
  const [paymentUrl, setPaymentUrl] = useState("")
  const { user } = useAuth()
  const { toast } = useToast()

  // Use the wallet credit query hook
  const { 
    data: walletData,
    isLoading: isBalanceLoading,
    refetch: refreshWalletBalance
  } = useWalletCredit({
    onError: (error) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to fetch wallet balance",
        variant: "destructive",
      })
    }
  })

  // Use the transactions query hook
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    refetch: refreshTransactions
  } = useCustomerTransactions({
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch transactions",
        variant: "destructive",
      })
    }
  })

  // Use the payment gateway mutation hook
  const paymentGatewayMutation = useInitPaymentGateway()
  const isLoading = paymentGatewayMutation.isLoading

  if (!user) return <Loading />

  // Get transactions directly from API response
  const transactions = transactionsData?.records || [];

  // Calculate balance from API
  const walletBalance = walletData?.amount ? walletData.amount : 0;

  // Calculate credited and debited amounts
  const calculateCredited = (items: Transaction[]): number => {
    if (items.length === 0) return 0;
    return items
      .filter(t => parseFloat(t.amount) > 0)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }

  const calculateDebited = (items: Transaction[]): number => {
    if (items.length === 0) return 0;
    return Math.abs(
      items
        .filter(t => parseFloat(t.amount) < 0)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    );
  }

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionAmount = parseFloat(transaction.amount);
    if (filter === "credited" && transactionAmount <= 0) return false;
    if (filter === "debited" && transactionAmount > 0) return false;
    if (searchQuery && !transaction.comment.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "OMR",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Handle adding money to wallet
  const handleAddMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive",
      })
      return
    }

    try {
      const paymentData: AddToWalletData = {
        amount: amount,
        payment_method_id: "1", // Default payment method
        comment: comment,
        order_total_amount: amount, // Using same amount as total
        action: "add_to_wallet"
      }

      const result = await paymentGatewayMutation.mutateAsync(paymentData)

      if (!result.error && result.pay_url) {
        // Open the payment URL in the dialog
        setPaymentUrl(result.pay_url)
        setIsAddMoneyOpen(false)
        setIsPaymentOpen(true)
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to initialize payment",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error initiating payment:", error)
      toast({
        title: "Error",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle payment completion
  const handlePaymentClose = () => {
    setIsPaymentOpen(false)
    setPaymentUrl("")
    // Refresh data after payment
    refreshWalletBalance()
    refreshTransactions()
    toast({
      title: "Payment Closed",
      description: "Your payment session has ended. If your payment was successful, funds will be added to your wallet shortly.",
    })
  }

  return (
    <Main>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusIcon className="h-4 w-4" />
                Add Money
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Money to Wallet</DialogTitle>
                <DialogDescription>
                  Enter the amount you want to add to your wallet. You'll be redirected to a payment gateway to complete the transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="comment">Comment (Optional)</Label>
                  <Input
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a note"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddMoneyOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMoney} disabled={isLoading}>
                  {isLoading ? "Processing..." : "Add Money"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Payment Gateway Dialog */}
          <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
            <DialogContent className="sm:max-w-[700px] h-[600px] p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <DialogTitle className="text-xl">Payment Gateway</DialogTitle>
                <Button variant="ghost" size="icon" onClick={handlePaymentClose}>
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              {paymentUrl && (
                <div className="w-full h-[540px] overflow-hidden">
                  <iframe 
                    src={paymentUrl}
                    className="w-full h-full border-none"
                    title="Payment Gateway"
                    sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation"
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Balance Card */}
        <Card className="w-full bg-gradient-to-r from-[#1D0D25] to-[#673086] text-white">
          <CardHeader>
            <CardDescription className="text-white/80">Current Balance</CardDescription>
            <CardTitle className="text-4xl font-bold">
              {isBalanceLoading ? (
                <div className="h-9 w-32 animate-pulse rounded bg-white/20"></div>
              ) : (
                <span>{CURRENCY} {walletBalance}</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="h-5 w-5 text-green-300" />
                <span>Credited</span>
                <span className="font-semibold">
                  {`${CURRENCY} ${calculateCredited(transactions)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownIcon className="h-5 w-5 text-red-300" />
                <span>Debited</span>
                <span className="font-semibold">
                  {`${CURRENCY} ${calculateDebited(transactions)}`}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
              Send
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
              Request
            </Button>
          </CardFooter>
        </Card>

        {/* Transactions Section */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Transactions</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative w-full sm:w-auto">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="credited">Credited</SelectItem>
                    <SelectItem value="debited">Debited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="credited">Credited</TabsTrigger>
                <TabsTrigger value="debited">Debited</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {isTransactionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No transactions found</div>
                ) : (
                  <div className="space-y-4">
                    {filteredTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-lg">
                            💰
                          </div>
                          <div>
                            <div className="font-medium">{transaction.comment}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={parseFloat(transaction.amount) > 0 ? "outline" : "secondary"}
                            className={parseFloat(transaction.amount) > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}
                          >
                            {parseFloat(transaction.amount) > 0 ? "Credited" : "Debited"}
                          </Badge>
                          <span
                            className={`font-semibold ${parseFloat(transaction.amount) > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {parseFloat(transaction.amount) > 0 ? "+" : ""}
                            {`${CURRENCY} ${Math.abs(parseFloat(transaction.amount)).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="credited" className="space-y-4">
                {isTransactionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : transactions.filter(t => parseFloat(t.amount) > 0).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No credited transactions found</div>
                ) : (
                  <div className="space-y-4">
                    {transactions
                      .filter(t => parseFloat(t.amount) > 0)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-lg">
                              💰
                            </div>
                            <div>
                              <div className="font-medium">{transaction.comment}</div>
                              <div className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-green-600 bg-green-50">
                              Credited
                            </Badge>
                            <span className="font-semibold text-green-600">
                              +{`${CURRENCY} ${parseFloat(transaction.amount).toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="debited" className="space-y-4">
                {isTransactionsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
                          <div className="space-y-2">
                            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                            <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : transactions.filter(t => parseFloat(t.amount) < 0).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No debited transactions found</div>
                ) : (
                  <div className="space-y-4">
                    {transactions
                      .filter(t => parseFloat(t.amount) < 0)
                      .map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-lg">
                              💰
                            </div>
                            <div>
                              <div className="font-medium">{transaction.comment}</div>
                              <div className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-red-600 bg-red-50">
                              Debited
                            </Badge>
                            <span className="font-semibold text-red-600">
                              {`${CURRENCY} ${Math.abs(parseFloat(transaction.amount)).toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => refreshTransactions()}>
              Refresh Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Main>
  )
}

export default WalletPage